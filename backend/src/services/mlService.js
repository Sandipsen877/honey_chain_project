import axios from "axios";
import FormData from "form-data";

const getMlServiceUrl = () => process.env.ML_SERVICE_URL?.replace(/\/$/, "");

/**
 * Wraps calls to an external ML microservice (intended to be FastAPI).
 * If ML_SERVICE_URL is not set, or the service is unreachable/errors,
 * every function falls back to a simple internal heuristic so the
 * rest of the app (and demos) keep working without a live ML service.
 *
 * Expected FastAPI contract (implement these when ready):
 *   POST {ML_SERVICE_URL}/predict/disease-risk
 *     body: { readings: [{temperatureC, humidityPct, weightKg, recordedAt}, ...] }
 *     resp: { riskLevel: "low"|"medium"|"high", confidence: 0-1, notes: string }
 *
 *   POST {ML_SERVICE_URL}/predict/yield
 *     body: { hiveCount, environmentType, region, season, avgWeightTrendKgPerWeek }
 *     resp: { estimatedYieldKg: number, confidence: 0-1 }
 *
 *   POST {ML_SERVICE_URL}/predict/health
 *     body: { hive_id, temperature, humidity, outside_temperature,
 *             outside_humidity, pressure, co2, tvoc, light, bee_in, bee_out }
 *     resp: { hive_id, health_score, health_status, bee_activity,
 *             inspection_required }
 */

async function predictDiseaseRisk(readings) {
  const mlServiceUrl = getMlServiceUrl();
  if (mlServiceUrl) {
    try {
      const { data } = await axios.post(
        `${mlServiceUrl}/predict/disease-risk`,
        { readings },
        { timeout: 4000 }
      );
      return { ...data, source: "ml_service" };
    } catch (err) {
      console.warn("[mlService] disease-risk call failed, falling back:", err.message);
    }
  }
  return heuristicDiseaseRisk(readings);
}

async function predictYield(params) {
  const mlServiceUrl = getMlServiceUrl();
  if (mlServiceUrl) {
    try {
      const { data } = await axios.post(`${mlServiceUrl}/predict/yield`, params, {
        timeout: 4000,
      });
      return { ...data, source: "ml_service" };
    } catch (err) {
      console.warn("[mlService] yield call failed, falling back:", err.message);
    }
  }
  return heuristicYield(params);
}

/**
 * Runs the health/alert model. Unlike yield and disease-risk, this model has
 * no local fallback: callers must know when a live inspection prediction was
 * unavailable instead of receiving an invented result.
 */
async function predictAlert(payload) {
  const mlServiceUrl = getMlServiceUrl();
  if (!mlServiceUrl) {
    const error = new Error("ML_SERVICE_URL is not configured");
    error.statusCode = 503;
    throw error;
  }

  try {
    const { data } = await axios.post(`${mlServiceUrl}/predict/health`, payload, {
      timeout: 4000,
    });
    return { ...data, source: "ml_service" };
  } catch (err) {
    console.warn("[mlService] alert prediction call failed:", err.message);
    const error = new Error("Alert ML service is unavailable");
    error.statusCode = 502;
    throw error;
  }
}

/**
 * Sends one webcam/image frame to the Varroa YOLO model. The backend owns the
 * ML-service URL, so browsers never need direct access to the Python service.
 */
async function predictVarroa(file) {
  const mlServiceUrl = getMlServiceUrl();
  if (!mlServiceUrl) {
    const error = new Error("ML_SERVICE_URL is not configured");
    error.statusCode = 503;
    throw error;
  }

  const form = new FormData();
  form.append("file", file.buffer, {
    filename: file.originalname || "webcam-frame.jpg",
    contentType: file.mimetype || "image/jpeg",
  });

  try {
    const { data } = await axios.post(`${mlServiceUrl}/predict/varroa`, form, {
      headers: form.getHeaders(),
      timeout: 15000,
      maxBodyLength: 10 * 1024 * 1024,
    });
    return { ...data, source: "ml_service" };
  } catch (err) {
    const detail = err.response?.data?.detail;
    console.warn("[mlService] Varroa prediction call failed:", detail || err.message);
    const error = new Error(detail || "Varroa ML service is unavailable");
    error.statusCode = err.response?.status || 502;
    throw error;
  }
}

// ---- Fallback heuristics (used when no ML service is configured/reachable) ----

function heuristicDiseaseRisk(readings) {
  if (!readings || readings.length < 2) {
    return { riskLevel: "low", confidence: 0.3, notes: "Not enough data yet.", source: "heuristic" };
  }
  const sorted = [...readings].sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const weightDropPct =
    first.weightKg && last.weightKg ? ((first.weightKg - last.weightKg) / first.weightKg) * 100 : 0;

  let riskLevel = "low";
  let notes = "Readings within expected range.";
  if (weightDropPct > 8) {
    riskLevel = "high";
    notes = "Sharp hive weight drop detected — possible disease, swarming, or robbing. Inspect soon.";
  } else if (weightDropPct > 4 || last.temperatureC > 36 || last.humidityPct > 70) {
    riskLevel = "medium";
    notes = "Mild anomaly detected in weight/temperature/humidity. Recommend inspection.";
  }
  return { riskLevel, confidence: 0.5, notes, source: "heuristic" };
}

function heuristicYield({ hiveCount = 0, environmentType = "mixed", avgWeightTrendKgPerWeek = 0 }) {
  // Very rough placeholder formula: base per-hive yield adjusted by environment and observed trend.
  const baseYieldPerHiveKg = { hot: 18, cold: 10, temperate: 22, humid: 14, mixed: 16 }[environmentType] ?? 16;
  const trendAdjustment = avgWeightTrendKgPerWeek * 4; // rough seasonal projection
  const estimatedYieldKg = Math.max(0, hiveCount * baseYieldPerHiveKg + trendAdjustment);
  return { estimatedYieldKg: Math.round(estimatedYieldKg * 10) / 10, confidence: 0.4, source: "heuristic" };
}

export { predictDiseaseRisk, predictYield, predictAlert, predictVarroa };
