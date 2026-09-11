import express from "express";
const router = express.Router();
import Alert from "../models/Alert.js";
import { predictAlert } from "../services/mlService.js";

const ALERT_MODEL_FIELDS = [
  "hive_id",
  "temperature",
  "humidity",
  "outside_temperature",
  "outside_humidity",
  "pressure",
  "co2",
  "tvoc",
  "light",
  "bee_in",
  "bee_out",
];

// POST /api/alerts/predict - run the FastAPI health/inspection alert model
router.post("/predict", async (req, res) => {
  const missingFields = ALERT_MODEL_FIELDS.filter(
    (field) => req.body[field] === undefined || req.body[field] === null
  );
  if (missingFields.length) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  const invalidNumericFields = ALERT_MODEL_FIELDS.slice(1).filter(
    (field) => !Number.isFinite(Number(req.body[field]))
  );
  if (invalidNumericFields.length) {
    return res.status(400).json({ error: `Fields must be numeric: ${invalidNumericFields.join(", ")}` });
  }

  try {
    // Send only the model contract fields, avoiding accidental API-field leakage.
    const payload = Object.fromEntries(ALERT_MODEL_FIELDS.map((field) => [field, req.body[field]]));
    const result = await predictAlert(payload);
    res.json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

// GET /api/alerts?farmId=&hiveId=&status=open
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.farmId) filter.farm = req.query.farmId;
  if (req.query.hiveId) filter.hive = req.query.hiveId;
  if (req.query.status) filter.status = req.query.status;
  const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json(alerts);
});

// PATCH /api/alerts/:id/resolve
router.patch("/:id/resolve", async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(req.params.id, { status: "resolved" }, { new: true });
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  res.json(alert);
});

export default router;
