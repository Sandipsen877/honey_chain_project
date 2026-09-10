# Data

The full research/training datasets are intentionally **not committed** to this repository. They are synthetic honey-production datasets used during model development and are kept separately.

`sample/` contains a small representative CSV showing the input schema expected by the training/prediction pipeline.

## Training data used for the published prototype

- `Honey_Production_Dataset_2023.csv`
- `Honey_Production_Dataset_2024_Ideal.csv`
- `Honey_Production_Dataset_2024_NonIdeal.csv`

The 2023 and 2024 Ideal files are used for chronological model development/evaluation; the 2024 Non-Ideal file is used as an out-of-domain stress test. The supplied target data is synthetic/simulated and should not be interpreted as field measurements.

For a production model, replace this data with real hive-level records containing a shared HiveID/timestamp and actual harvested honey weight.
