# Honey Chain ML API

This API wraps the trained `honey_yield_model.joblib` model so the Honey Chain backend can call it without running the training notebook.

## Run locally

From the repository root:

```bash
pip install -r requirements.txt
uvicorn api.app:app --reload
```

Open the interactive API documentation at `/docs`.

## Prediction endpoint

`POST /predict`

The current prototype model requires a **chronological history of at least 14 observations** because it uses 1/3/7/14-day honey-weight lags and rolling features. Each observation contains:

- date
- historical honey weight (kg)
- environmental temperature
- relative humidity
- hive temperature
- hive humidity
- wind speed
- whether honey extraction occurred that day

The API calculates the 22 engineered features internally and returns the predicted honey weight 7 days ahead.

### Example request

```json
{
  "history": [
    {
      "date": "2024-01-01",
      "honey_weight_kg": 1.2,
      "environmental_temperature_c": 22.1,
      "relative_humidity_pct": 61.0,
      "hive_temperature_c": 33.4,
      "hive_humidity_pct": 64.0,
      "wind_speed_kmh": 8.0,
      "extract_honey": false
    }
  ]
}
```

Repeat the observation object for at least 14 chronological dates.

### Example response

```json
{
  "predicted_honey_weight_7_days_kg": 15.8,
  "prediction_horizon_days": 7,
  "model": "random_forest",
  "note": "Prototype forecast trained on synthetic honey-production data."
}
```

## Important integration limitation

Do **not** map BeeObserver `weight_kg` directly to `honey_weight_kg`. BeeObserver's weight is total hive mass, not measured extracted honey yield. The current model was trained on a separate synthetic honey-weight dataset. A production model should be retrained when real hive sensor history is paired with actual harvested honey weight using a shared HiveID and timestamp.
