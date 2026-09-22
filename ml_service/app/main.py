from typing import List
import io

import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from .health_engine import calculate_health_score
from .model_loader import load_models


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

class BeeHaveReading(BaseModel):

    temperature: float
    temperature_gradient: float

    outside_temperature: float
    outside_temperature_feels_like: float

    temperature_difference: float

    humidity: float
    outside_humidity: float

    wind: float
    rain: float

    co2: float
    pressure: float


class BeeHaveDay(BaseModel):

    day: int

    week_sin: float
    week_cos: float

    readings: List[BeeHaveReading]


class BeeHave7DayRequest(BaseModel):

    hive_id: str

    current_weight_kg: float

    days: List[BeeHaveDay]


@app.get("/")
def root():

    return {
        "service": "Honey Chain ML Service",
        "status": "running",
        "models_loaded": list(models.keys())
    }





@app.post("/predict/health")
def predict(data: SensorData):

    result = calculate_health_score(
        temperature=data.temperature,
        humidity=data.humidity,
        co2=data.co2,
        tvoc=data.tvoc,
        bee_in=data.bee_in,
        bee_out=data.bee_out,
        outside_temperature=data.outside_temperature,
        outside_humidity=data.outside_humidity,
        pressure=data.pressure,
        light=data.light,
    )

    return {
        "hive_id": data.hive_id,

        "health_score": result["score"],
        "health_status": result["status"],

        "bee_activity": result["bee_activity"],
        "bee_in": result["bee_in"],
        "bee_out": result["bee_out"],
        "bee_flow": result["bee_flow"],

        "components": result["components"],

        "risk_factors": result["risk_factors"],
        "recommendations": result["recommendations"],

        "inspection_required":
            result["inspection_required"],
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


@app.post("/predict/yield",
    summary="7-day hive weight forecast",
    description=(
        "Uses the BeeHave environmental model recursively "
        "for a 7-day hive weight forecast."
    )
)
def predict_beehave_7day(
    data: BeeHave7DayRequest
):

    if len(data.days) != 7:

        raise HTTPException(
            status_code=400,
            detail="Exactly 7 forecast days are required."
        )

    try:

        model = models["BEEHAVE"]

        current_weight = data.current_weight_kg

        daily_forecast = []

        cumulative_change = 0.0

        for forecast_day in data.days:

            if len(forecast_day.readings) != 144:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Day {forecast_day.day} "
                        f"must contain exactly 144 readings."
                    )
                )

            # ------------------------------------------------
            # Construct BeeHave raw input
            # Shape = (1, 144, 40)
            # ------------------------------------------------

            raw = np.zeros(
                (1, 144, 40),
                dtype=float
            )

            raw[:, :, 2] = forecast_day.week_sin
            raw[:, :, 3] = forecast_day.week_cos

            for i, reading in enumerate(
                forecast_day.readings
            ):

                raw[0, i, 4] = (
                    reading.temperature
                )

                raw[0, i, 5] = (
                    reading.temperature_gradient
                )

                raw[0, i, 6] = (
                    reading.outside_temperature
                )

                raw[0, i, 7] = (
                    reading.outside_temperature_feels_like
                )

                raw[0, i, 8] = (
                    reading.temperature_difference
                )

                raw[0, i, 9] = (
                    reading.humidity
                )

                raw[0, i, 10] = (
                    reading.outside_humidity
                )

                raw[0, i, 11] = (
                    reading.wind
                )

                raw[0, i, 12] = (
                    reading.rain
                )

                raw[0, i, 13] = (
                    reading.co2
                )

                raw[0, i, 14] = (
                    reading.pressure
                )

            # ------------------------------------------------
            # BeeHave prediction
            # ------------------------------------------------

            prediction = float(
                model.predict(raw)[0]
            )

            cumulative_change += prediction

            predicted_weight = (
                current_weight
                + cumulative_change
            )

            daily_forecast.append({

                "day": forecast_day.day,

                "predicted_weight_change_kg":
                    round(prediction, 3),

                "cumulative_weight_change_kg":
                    round(cumulative_change, 3),

                "predicted_weight_kg":
                    round(predicted_weight, 3)
            })

        return {
    "status": "ok",
    "hive_id": data.hive_id,
    "forecast_days": 7,
    "predicted_7_day_weight_change_kg": round(
        cumulative_change, 3
    ),
    "predicted_weight_after_7_days_kg": round(
        current_weight + cumulative_change, 3
    )
}

    except HTTPException:
        raise

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"BeeHave 7-day prediction failed: {e}"
            )
        )