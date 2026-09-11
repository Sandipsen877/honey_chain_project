import express from "express";
import multer from "multer";
const router = express.Router();
import Alert from "../models/Alert.js";
import Hive from "../models/Hive.js";
import { predictAlert, predictVarroa } from "../services/mlService.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

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

// POST /api/alerts/varroa - webcam/image frame -> backend -> FastAPI YOLO model
router.post(
  "/varroa",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    const imageFile = req.files?.file?.[0] || req.files?.image?.[0];

    if (!imageFile) {
      return res.status(400).json({ error: "Upload one image in the 'file' field" });
    }

    try {
      const result = await predictVarroa(imageFile);
      let savedAlert = null;

      if (result?.detected === true || Number(result?.count) > 0) {
        const hiveId = req.body?.hiveId || req.body?.hive;
        let farmId = req.body?.farmId || req.body?.farm;

        if (!hiveId) {
          return res.status(400).json({
            error: "hiveId is required when Varroa is detected so an alert can be saved",
            result,
          });
        }

        if (!farmId) {
          const hive = await Hive.findById(hiveId);
          farmId = hive?.farm;
        }

        if (!farmId) {
          return res.status(400).json({
            error: "farmId is required when Varroa is detected so an alert can be saved",
            result,
          });
        }

        const detections = Array.isArray(result.detections) ? result.detections : [];
        const bestConfidence = detections.reduce(
          (best, detection) => Math.max(best, Number(detection?.confidence) || 0),
          0
        );
        const count = Number(result.count) || detections.length || 0;
        const confidenceText = bestConfidence
          ? ` Highest confidence ${(bestConfidence * 100).toFixed(0)}%.`
          : "";

        savedAlert = await Alert.findOneAndUpdate(
          {
            hive: hiveId,
            type: "varroa",
            status: "open",
          },
          {
            $set: {
              farm: farmId,
              severity: "high",
              message: `Varroa detected: ${count} mite${count === 1 ? "" : "s"} found.${confidenceText}`,
              suggestedAction: "Inspect this hive immediately and start Varroa treatment protocol if confirmed.",
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );
      }

      res.json({
        ...result,
        savedAlert,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
);

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
