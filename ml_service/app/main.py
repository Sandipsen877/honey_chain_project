from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

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


@app.post("/predict")
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