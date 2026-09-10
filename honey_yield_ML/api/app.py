from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import joblib

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = joblib.load(ROOT / "model" / "honey_yield_model.joblib")
MODEL = BUNDLE["model"]
FEATURES = BUNDLE["features"]
TARGET = BUNDLE["target"]

ENV = {
    "Environmental Temperature (°C)": "env_temp",
    "Relative Humidity (%)": "env_humidity",
    "Hive Temperature (°C)": "hive_temp",
    "Hive Humidity (%)": "hive_humidity",
    "Wind Speed (km/h)": "wind_speed",
}

app = FastAPI(
    title="Honey Chain ML API",
    version="1.0.0",
    description="7-day honey-weight forecasting API for the Honey Chain prototype."
)

class Observation(BaseModel):
    date: str
    honey_weight_kg: float = Field(..., description="Historical honey weight used by the prototype model.")
    environmental_temperature_c: float
    relative_humidity_pct: float
    hive_temperature_c: float
    hive_humidity_pct: float
    wind_speed_kmh: float
    extract_honey: bool = False

class PredictionRequest(BaseModel):
    history: List[Observation] = Field(..., min_length=15, description="Chronological history. At least 14 observations are required.")

class PredictionResponse(BaseModel):
    predicted_honey_weight_7_days_kg: float
    prediction_horizon_days: int = 7
    model: str
    note: str


def build_features(history: pd.DataFrame) -> pd.DataFrame:
    d = history.copy()
    d["Date"] = pd.to_datetime(d["Date"], errors="coerce")
    d = d.sort_values("Date").reset_index(drop=True)

    for c in ENV:
        d[c] = pd.to_numeric(d[c], errors="coerce")
    d[TARGET] = pd.to_numeric(d[TARGET], errors="coerce")
    d["Extract Honey"] = d["Extract Honey"].astype(bool)

    if d["Date"].isna().any():
        raise ValueError("Invalid date supplied.")
    if d["Date"].duplicated().any():
        raise ValueError("Duplicate dates are not allowed in the history.")

    # Backward-looking extraction feature only.
    last = None
    days = []
    for _, row in d.iterrows():
        if row["Extract Honey"]:
            last = row["Date"]
            days.append(0.0)
        elif last is None:
            days.append(999.0)
        else:
            days.append(float((row["Date"] - last).days))
    d["days_since_last_extraction"] = days

    # Past-only honey history.
    for lag in [1, 3, 7, 14]:
        d[f"honey_lag{lag}"] = d[TARGET].shift(lag)
    d["honey_roll_mean_7"] = d[TARGET].shift(1).rolling(7, min_periods=1).mean()
    d["honey_roll_std_7"] = d[TARGET].shift(1).rolling(7, min_periods=2).std().fillna(0)
    d["honey_roll_mean_14"] = d[TARGET].shift(1).rolling(14, min_periods=1).mean()
    d["honey_diff_1"] = d[TARGET].shift(1).diff(1)

    for src, short in ENV.items():
        d[short] = d[src]
        d[f"{short}_roll7"] = d[src].shift(1).rolling(7, min_periods=1).mean()

    d["doy_sin"] = np.sin(2 * np.pi * d["Date"].dt.dayofyear / 365.25)
    d["doy_cos"] = np.cos(2 * np.pi * d["Date"].dt.dayofyear / 365.25)
    d["month"] = d["Date"].dt.month

    row = d.iloc[[-1]]
    if row[FEATURES].isna().any().any():
        missing = row[FEATURES].columns[row[FEATURES].isna().iloc[0]].tolist()
        raise ValueError(f"Insufficient history or missing values for: {missing}")
    return row[FEATURES]


def make_dataframe(items: List[Observation]) -> pd.DataFrame:
    rows = []
    for x in items:
        rows.append({
            "Date": x.date,
            "Honey Weight (kg)": x.honey_weight_kg,
            "Environmental Temperature (°C)": x.environmental_temperature_c,
            "Relative Humidity (%)": x.relative_humidity_pct,
            "Hive Temperature (°C)": x.hive_temperature_c,
            "Hive Humidity (%)": x.hive_humidity_pct,
            "Wind Speed (km/h)": x.wind_speed_kmh,
            "Extract Honey": x.extract_honey,
        })
    return pd.DataFrame(rows)

@app.get("/")
def root():
    return {"service": "Honey Chain ML API", "status": "ready", "horizon_days": 7}

@app.get("/health")
def health():
    return {"status": "ok", "model": BUNDLE.get("model_name", "unknown")}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        history = make_dataframe(request.history)
        X = build_features(history)
        prediction = float(MODEL.predict(X)[0])
        return PredictionResponse(
            predicted_honey_weight_7_days_kg=round(prediction, 3),
            model=BUNDLE.get("model_name", "random_forest"),
            note="Prototype forecast trained on synthetic honey-production data."
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
