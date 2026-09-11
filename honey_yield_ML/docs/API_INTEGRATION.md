# Backend Integration

The trained model is stored as a joblib bundle in `model/honey_yield_model.joblib`.

```python
import pandas as pd
from src.predict import predict_7_day

history = pd.read_csv("your_hive_history.csv")
prediction_kg = predict_7_day(history)
print(f"Predicted honey weight in 7 days: {prediction_kg:.2f} kg")
```

The supplied history must contain the columns required by the feature pipeline, including `Date`, `Honey Weight (kg)`, `Extract Honey`, and the environmental/hive fields used by the model.

## Suggested API response

```json
{
  "horizon_days": 7,
  "predicted_honey_weight_kg": 12.4,
  "model": "random_forest",
  "status": "prototype"
}
```

For the real Honey Chain deployment, the backend should build the same feature schema from live IoT and beekeeper records rather than requiring users to upload CSV files.
