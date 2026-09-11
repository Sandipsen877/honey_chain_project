# Model Card — Honey Chain Honey Forecasting Model

## Model

**Random Forest Regressor** for 7-day-ahead honey-weight forecasting.

## Intended use

Demonstration/prototyping for the Honey Chain smart-beekeeping platform and SIH project. The model illustrates an end-to-end forecasting pipeline and backend integration pattern.

## Not intended for

- Claiming field-validated honey-yield accuracy
- Financial or operational decisions without validation
- Direct inference of actual harvested honey from unpaired sensor data
- Treating hive total weight as equivalent to honey yield

## Target

`Honey Weight (kg)` at T+7 days.

## Training data

The published prototype was trained using the supplied synthetic/simulated 2023 and 2024 Ideal honey-production datasets. The supplied 2024 Non-Ideal dataset was reserved for out-of-domain evaluation.

## Reported prototype performance

The independent reproduction is approximately:

| Evaluation | MAE | RMSE | R² |
|---|---:|---:|---:|
| Chronological in-domain test | 2.55 kg | 6.72 kg | 0.86 |
| Non-Ideal out-of-domain test | 3.29 kg | — | 0.66 |

Exact metrics are stored in `model/training_report.json` for the packaged model. Small differences can occur when retraining because of data/preprocessing versions.

## Limitations

- Synthetic target data
- Single-series/single-hive-style target structure
- No real harvested-honey ground truth in the uploaded data
- No legitimate join between the target data and the separate BeeObserver/HCC/weather datasets
- Results are directional and not production validation

## Production path

Collect real records with:

`HiveID + timestamp + hive sensor readings + weather/inspection context + actual harvested honey (kg)`

Then retrain and evaluate with hive-aware and chronological splits.
