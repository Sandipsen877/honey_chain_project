# Dataset Roles

The project evaluated multiple datasets, but they do not all serve the same ML role.

| Dataset family | Role |
|---|---|
| Honey Production 2023 | Explicit synthetic honey-weight target; model development |
| Honey Production 2024 Ideal | Chronological continuation/holdout development data |
| Honey Production 2024 Non-Ideal | Out-of-domain stress test |
| BeeObserver | Real IoT hive sensor data; future feature pipeline, not current yield target |
| HCC Inspections | Real inspection/colony-condition context; no paired yield target |
| Hive/Apiary Information | Metadata/context; no valid join to target series |
| Weather datasets | Environmental context from a different period/location; no valid join to target series |

The datasets must not be artificially joined without a defensible shared HiveID and synchronized timestamp.
