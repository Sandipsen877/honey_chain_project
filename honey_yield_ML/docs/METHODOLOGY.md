# Methodology

## Prediction task

Honey Chain's prototype predicts **Honey Weight (kg) 7 days ahead** from information available at the prediction date.

## Features

The model uses only backward-looking information:

- Honey-weight lags: 1, 3, 7 and 14 days
- 7-day and 14-day rolling honey-weight statistics
- Day-over-day historical honey-weight change
- Current environmental temperature, humidity and wind speed
- Hive temperature and hive humidity
- 7-day backward rolling environmental statistics
- Days since the most recent extraction event
- Seasonal day-of-year sine/cosine and month

## Leakage prevention

The supplied `Total Weight (Hive + Bees + Honey) (kg)` column is excluded because, in the supplied data, it is essentially a deterministic transformation of the target. Future extraction values are also not used; extraction contributes only through a historical `days_since_last_extraction` feature.

All target lags and rolling windows are shifted so that future target values cannot enter the features.

## Evaluation

The primary evaluation is chronological: earlier observations are used for training and the latest approximately 20% are held out. A separate 2024 Non-Ideal Conditions dataset is used as an out-of-domain evaluation set.

Metrics:

- MAE (kg)
- RMSE (kg)
- R²
- MAPE (%)

## Important limitation

This is a proof-of-concept trained on synthetic/simulated target data. It does **not** establish field-level honey-yield accuracy. Production deployment requires real harvested-honey measurements paired with hive sensor data by HiveID and timestamp.
