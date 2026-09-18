import express from "express";
const router = express.Router();
import Farm from "../models/Farm.js";
import Hive from "../models/Hive.js";
import SensorReading from "../models/SensorReading.js";
import { predictYield, predictHoneyYield, predictDiseaseRisk } from "../services/mlService.js";

// POST /api/yield/predict  body: { history: [at least 15 yield observations] }
// The history is passed directly to the dedicated yield ML API.
router.post("/predict", async (req, res) => {
  const { hive_id, current_weight_kg, days } = req.body;

  // Basic payload validation
  if (!hive_id) {
    return res.status(400).json({
      error: "hive_id is required",
    });
  }

  if (
    typeof current_weight_kg !== "number" ||
    !Number.isFinite(current_weight_kg)
  ) {
    return res.status(400).json({
      error: "current_weight_kg must be a valid number",
    });
  }

  if (!Array.isArray(days)) {
    return res.status(400).json({
      error: "days must be an array",
    });
  }

  if (days.length !== 7) {
    return res.status(400).json({
      error: "Exactly 7 forecast days are required",
    });
  }

  for (const day of days) {
    if (!Array.isArray(day.readings)) {
      return res.status(400).json({
        error: `Day ${day.day} readings must be an array`,
      });
    }

    if (day.readings.length !== 144) {
      return res.status(400).json({
        error: `Day ${day.day} must contain exactly 144 readings`,
      });
    }
  }

  try {
    const result = await predictHoneyYield({
      hive_id,
      current_weight_kg,
      days,
    });

    return res.json(result);
  } catch (err) {
    console.error("[yield route] prediction failed:", err);

    return res.status(err.statusCode || 502).json({
      error: err.message || "Yield prediction failed",
    });
  }
});

// POST /api/yield/estimate  body: { farmId, season }
router.post("/estimate", async (req, res) => {
  try {
    const { farmId, season } = req.body;
    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ error: "Farm not found" });

    const hives = await Hive.find({ farm: farmId, status: "active" });
    let avgWeightTrendKgPerWeek = 0;
    if (hives.length) {
      const trends = await Promise.all(
        hives.map(async (h) => {
          const readings = await SensorReading.find({ hive: h._id }).sort({ recordedAt: -1 }).limit(20);
          if (readings.length < 2) return 0;
          const newest = readings[0];
          const oldest = readings[readings.length - 1];
          const days =
            (new Date(newest.recordedAt) - new Date(oldest.recordedAt)) / (1000 * 60 * 60 * 24) || 1;
          const deltaKg = (newest.weightKg || 0) - (oldest.weightKg || 0);
          return (deltaKg / days) * 7;
        })
      );
      avgWeightTrendKgPerWeek = trends.reduce((a, b) => a + b, 0) / trends.length;
    }

    const result = await predictYield({
      hiveCount: farm.hiveCount,
      environmentType: farm.environmentType,
      region: farm.location?.state,
      season,
      avgWeightTrendKgPerWeek,
    });

    res.json({ farmId, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/yield/disease-risk/:hiveId - detection only, no control action taken
router.get("/disease-risk/:hiveId", async (req, res) => {
  try {
    const readings = await SensorReading.find({ hive: req.params.hiveId })
      .sort({ recordedAt: -1 })
      .limit(15);
    const result = await predictDiseaseRisk(readings);
    res.json({ hiveId: req.params.hiveId, ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
