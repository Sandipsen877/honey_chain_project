import Alert from "../models/Alert.js";
import { predictAlert } from "./mlService.js";

// Fields the FastAPI /predict/health model requires (see mlService.js / ML_SERVICE_URL).
const REQUIRED_FIELDS = [
  "temperatureC",
  "humidityPct",
  "outsideTemperatureC",
  "outsideHumidityPct",
  "pressureHPa",
  "co2Ppm",
  "tvocPpb",
  "light",
  "beeIn",
  "beeOut",
];

function hasAllRequiredFields(reading) {
  return REQUIRED_FIELDS.every(
    (field) => reading[field] !== undefined && reading[field] !== null
  );
}

function severityForStatus(status) {
  if (status === "Critical") return "high";
  if (status === "Warning") return "medium";
  return "low";
}

/**
 * Evaluates a sensor reading using the ML health model (FastAPI /predict/health)
 * and creates an Alert document if the model flags the hive as needing inspection.
 * Returns an array of created Alert docs (empty array if no alert was warranted,
 * the ML service is unreachable, or the reading doesn't have the fields the model needs).
 *
 * This replaces the old rule-based alertEngine.js: alerts now come from the ML
 * model only, not from hardcoded JS thresholds.
 */
async function evaluateReadingWithML(reading) {
  if (!hasAllRequiredFields(reading)) {
    console.warn(
      `[alertService] reading ${reading._id} is missing fields the ML model needs; skipping health prediction.`
    );
    return [];
  }

  const payload = {
    hive_id: String(reading.hive),
    temperature: reading.temperatureC,
    humidity: reading.humidityPct,
    outside_temperature: reading.outsideTemperatureC,
    outside_humidity: reading.outsideHumidityPct,
    pressure: reading.pressureHPa,
    co2: reading.co2Ppm,
    tvoc: reading.tvocPpb,
    light: reading.light,
    bee_in: reading.beeIn,
    bee_out: reading.beeOut,
  };

  let prediction;
  try {
    prediction = await predictAlert(payload);
  } catch (err) {
    console.warn(`[alertService] ML health prediction failed for hive ${reading.hive}:`, err.message);
    return [];
  }

  if (!prediction.inspection_required) {
    return [];
  }

  const doc = {
    hive: reading.hive,
    farm: reading.farm,
    type: "health_ml",
    severity: severityForStatus(prediction.health_status),
    message: `ML health score ${prediction.health_score} (${prediction.health_status}) — bee activity ${prediction.bee_activity}.`,
    suggestedAction: "Inspect hive: ML health model flagged this reading as needing attention.",
    sourceReading: reading._id,
  };

  return Alert.insertMany([doc]);
}

export { evaluateReadingWithML };
