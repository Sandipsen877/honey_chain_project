from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
from fastapi import UploadFile, File, HTTPException
from PIL import Image
import io
from typing import List
from datetime import date
from .yield_engine import build_yield_features
from .model_loader import load_models
from .health_engine import calculate_health_score


app = FastAPI(
    title="Honey Chain ML Service",
    version="1.0.0"
)


models = load_models()


class SensorData(BaseModel):

    hive_id: str

    temperature: float
    humidity: float

    outside_temperature: float
    outside_humidity: float

    pressure: float

    co2: float
    tvoc: float

    light: float

    bee_in: int
    bee_out: int


@app.get("/")
def root():

    return {
        "service": "Honey Chain ML Service",
        "status": "running",
        "models_loaded": list(models.keys())
    }

class YieldObservation(BaseModel):

    date: str

    honey_weight_kg: float

    environmental_temperature_c: float
    relative_humidity_pct: float

    hive_temperature_c: float
    hive_humidity_pct: float

    wind_speed_kmh: float

    extract_honey: bool = False


class YieldPredictionRequest(BaseModel):

    history: List[YieldObservation]


@app.post("/predict/health")
def predict(data: SensorData):

    bee_activity = data.bee_in + data.bee_out

    health_score, status = calculate_health_score(
        temperature=data.temperature,
        humidity=data.humidity,
        co2=data.co2,
        tvoc=data.tvoc
    )

    return {
        "hive_id": data.hive_id,
        "health_score": health_score,
        "health_status": status,
        "bee_activity": bee_activity,
        "inspection_required": status != "Healthy"
    }

@app.post(
    "/predict/varroa",
    summary="Detect Varroa mites",
    description=(
        "Accepts a bee image and uses the trained YOLOv8 "
        "model to detect Varroa mites."
    )
)

async def predict_varroa(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )

    try:
        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        model = models["VARROA"]

        results = model.predict(
            source=image,
            imgsz=640,
            conf=0.40,
            verbose=False
        )

        result = results[0]

        detections = []

        if result.boxes is not None:

            for box in result.boxes:

                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = map(
                    float,
                    box.xyxy[0].tolist()
                )

                detections.append({
                    "class_id": class_id,
                    "class_name": model.names[class_id],
                    "confidence": confidence,
                    "bbox": {
                        "x1": x1,
                        "y1": y1,
                        "x2": x2,
                        "y2": y2
                    }
                })

        return {
            "status": "ok",
            "model_loaded": model is not None,
            "model": "best.pt",
            "classes": model.names if model else None,
            "detected": len(detections) > 0,
            "count": len(detections),
            "detections": detections
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get(
    "/health/varroa",
    summary="Check Varroa model status"
)
def varroa_health():

    model = models.get("VARROA")

    if model is None:
        return {
            "status": "error",
            "model_loaded": False,
            "model": "best.pt"
        }

    return {
        "status": "ok",
        "model_loaded": True,
        "model": "best.pt",
        "classes": model.names
    }

@app.post("/predict/yield")
def predict_yield(data: YieldPredictionRequest):

    if len(data.history) < 15:

        raise HTTPException(
            status_code=400,
            detail="At least 15 historical observations are required."
        )

    try:

        rows = []

        for item in data.history:

            rows.append({
                "Date": item.date,

                "Honey Weight (kg)":
                    item.honey_weight_kg,

                "Environmental Temperature (°C)":
                    item.environmental_temperature_c,

                "Relative Humidity (%)":
                    item.relative_humidity_pct,

                "Hive Temperature (°C)":
                    item.hive_temperature_c,

                "Hive Humidity (%)":
                    item.hive_humidity_pct,

                "Wind Speed (km/h)":
                    item.wind_speed_kmh,

                "Extract Honey":
                    item.extract_honey
            })

        history = pd.DataFrame(rows)

        bundle = models["YIELD"]

        X = build_yield_features(
            history,
            bundle["features"],
            bundle["target"]
        )

        prediction = float(
            bundle["model"].predict(X)[0]
        )

        return {
            "status": "ok",
            "predicted_honey_weight_7_days_kg":
                round(prediction, 3),
            "prediction_horizon_days": 7,
            "model": bundle.get(
                "model_name",
                "random_forest"
            )
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Yield prediction failed: {e}"
        )