import pandas as pd
import numpy as np


ENV = {
    "Environmental Temperature (°C)": "env_temp",
    "Relative Humidity (%)": "env_humidity",
    "Hive Temperature (°C)": "hive_temp",
    "Hive Humidity (%)": "hive_humidity",
    "Wind Speed (km/h)": "wind_speed",
}


def build_yield_features(history, features, target):

    d = history.copy()

    d["Date"] = pd.to_datetime(
        d["Date"],
        errors="coerce"
    )

    d = (
        d.sort_values("Date")
        .reset_index(drop=True)
    )

    for c in ENV:
        d[c] = pd.to_numeric(
            d[c],
            errors="coerce"
        )

    d[target] = pd.to_numeric(
        d[target],
        errors="coerce"
    )

    d["Extract Honey"] = (
        d["Extract Honey"]
        .astype(bool)
    )

    # Days since last extraction
    last = None
    days = []

    for _, row in d.iterrows():

        if row["Extract Honey"]:
            last = row["Date"]
            days.append(0.0)

        elif last is None:
            days.append(999.0)

        else:
            days.append(
                float(
                    (row["Date"] - last).days
                )
            )

    d["days_since_last_extraction"] = days

    # Historical honey features
    for lag in [1, 3, 7, 14]:

        d[f"honey_lag{lag}"] = (
            d[target].shift(lag)
        )

    d["honey_roll_mean_7"] = (
        d[target]
        .shift(1)
        .rolling(7, min_periods=1)
        .mean()
    )

    d["honey_roll_std_7"] = (
        d[target]
        .shift(1)
        .rolling(7, min_periods=2)
        .std()
        .fillna(0)
    )

    d["honey_roll_mean_14"] = (
        d[target]
        .shift(1)
        .rolling(14, min_periods=1)
        .mean()
    )

    d["honey_diff_1"] = (
        d[target]
        .shift(1)
        .diff(1)
    )

    # Environmental features
    for src, short in ENV.items():

        d[short] = d[src]

        d[f"{short}_roll7"] = (
            d[src]
            .shift(1)
            .rolling(7, min_periods=1)
            .mean()
        )

    # Seasonal features
    d["doy_sin"] = np.sin(
        2 * np.pi *
        d["Date"].dt.dayofyear /
        365.25
    )

    d["doy_cos"] = np.cos(
        2 * np.pi *
        d["Date"].dt.dayofyear /
        365.25
    )

    d["month"] = d["Date"].dt.month

    row = d.iloc[[-1]]

    if row[features].isna().any().any():

        missing = (
            row[features]
            .columns[
                row[features]
                .isna()
                .iloc[0]
            ]
            .tolist()
        )

        raise ValueError(
            f"Insufficient history or missing values: {missing}"
        )

    return row[features]