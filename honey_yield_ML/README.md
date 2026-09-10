# Honey Chain — AI Honey Production Forecasting

A reproducible machine-learning prototype for **7-day-ahead honey-weight forecasting** for the Honey Chain smart-beekeeping platform.

> **Important:** The supplied Honey Production target datasets are synthetic/simulated. This repository demonstrates the ML pipeline and integration architecture; it is **not a field-validated honey-yield model**.

## What the model predicts

At time **T**, the model uses information available at or before T to predict:

**Honey Weight (kg) at T + 7 days**

The prototype's best model is a **Random Forest Regressor**.

## Prototype performance

The independently reproduced model achieved approximately:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Persistence baseline | 4.11 kg | 13.48 kg | 0.43 |
| Linear Regression | 6.92 kg | 12.69 kg | 0.49 |
| **Random Forest** | **2.55 kg** | **6.72 kg** | **0.86** |
| XGBoost | 3.08 kg | 9.77 kg | 0.70 |

On the separate 2024 Non-Ideal Conditions dataset, Random Forest achieved approximately **3.29 kg MAE and R² = 0.66**.

These are prototype results on synthetic data, not claims of real-world accuracy.

## Leakage protection

The feature pipeline deliberately excludes:

- `Total Weight (Hive + Bees + Honey) (kg)` — it is effectively a deterministic transformation of the target in the supplied data.
- Future `Extract Honey` information.
- The target value at T itself as a feature for the T+7 target.

All target lags and rolling statistics are backward-looking.

## Repository

```text
honey-chain-ml/
├── data/
│   ├── README.md
│   └── sample/
│       └── sample_honey_production_2024.csv
├── docs/
│   ├── API_INTEGRATION.md
│   ├── DATASET.md
│   ├── METHODOLOGY.md
│   ├── MODEL_CARD.md
│   └── REPRODUCIBILITY.md
├── model/
│   ├── honey_yield_model.joblib
│   └── training_report.json
├── notebooks/
│   └── Honey_Chain_Honey_Yield_Model.ipynb
├── src/
│   ├── train_model.py
│   ├── predict.py
│   └── evaluate_model.py
├── .gitignore
└── requirements.txt
```

## Quick start

Install dependencies:

```bash
pip install -r requirements.txt
```

To retrain, obtain the three full datasets separately and place them in `data/` with the names described in `docs/REPRODUCIBILITY.md`, then run:

```bash
python src/train_model.py
```

To make a prediction:

```bash
python src/predict.py path/to/history.csv
```

Or from Python:

```python
import pandas as pd
from src.predict import predict_7_day

history = pd.read_csv("path/to/history.csv")
forecast = predict_7_day(history)
print(f"7-day forecast: {forecast:.2f} kg")
```

## Why BeeObserver is not merged into this model

BeeObserver provides real hive IoT measurements such as hive weight, temperature and humidity, but it has no directly paired quantitative honey-yield target and no defensible shared HiveID/timestamp with the synthetic Honey Production datasets. It therefore belongs in the **future real-world feature pipeline**, not as a fabricated join in the current model.

The production Honey Chain pipeline should eventually use:

```text
IoT hive sensors + weather + beekeeper inspections
                    ↓
            shared HiveID + timestamp
                    ↓
            feature engineering
                    ↓
       actual harvested honey (kg)
                    ↓
             ML forecasting
                    ↓
          Honey Chain dashboard
```

## Responsible project claim

The current repository demonstrates an end-to-end, leakage-controlled forecasting prototype. For deployment, Honey Chain needs real hive-level records pairing sensor observations with actual harvested honey weight.

## Backend integration

The repository includes a FastAPI wrapper in `api/app.py`. The backend should send a chronological history of at least 14 observations to `POST /predict`; the API performs the same feature engineering used during training and returns a 7-day honey-weight forecast.

See `api/README.md` and `api/example_request.json` for the request format.
