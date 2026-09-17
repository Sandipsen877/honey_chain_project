import numpy as np
import pandas as pd

from sklearn.base import BaseEstimator, TransformerMixin


class BeeHaveEnvironmentalFeatureEngineering(
    BaseEstimator,
    TransformerMixin
):

    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):

        X = np.asarray(X, dtype=object)

        # Expected raw BeeHave shape
        # (samples, 144, 40)

        if X.ndim != 3:
            raise ValueError(
                f"Expected 3D input (samples, 144, 40), "
                f"got {X.shape}"
            )

        if X.shape[1] != 144:
            raise ValueError(
                f"Expected 144 time points, got {X.shape[1]}"
            )

        if X.shape[2] != 40:
            raise ValueError(
                f"Expected 40 raw channels, got {X.shape[2]}"
            )

        # Same 3-hour windows used during training
        windows = [
            (0, 18),       # 01
            (18, 36),      # 04
            (36, 54),      # 07
            (54, 72),      # 10
            (72, 90),      # 13
            (90, 108),     # 16
            (108, 126),    # 19
            (126, 144)     # 22
        ]

        time_labels = [
            "01",
            "04",
            "07",
            "10",
            "13",
            "16",
            "19",
            "22"
        ]

        # Same environmental channel mapping used during training
        channel_map = {
            4: "T_in",
            5: "T_in_grad",
            6: "T_out",
            7: "T_out_feel",
            8: "T_diff",
            9: "HumidIn",
            10: "HumidOut",
            11: "Wind",
            12: "rain",
            13: "CO2",
            14: "Pr"
        }

        rows = []

        for i in range(X.shape[0]):

            row = {}

            # Week / Season
            row["WeekSin"] = float(X[i, 0, 2])
            row["WeekCos"] = float(X[i, 0, 3])

            # Environmental features
            # 3-hour mean
            for channel_idx, feature_name in channel_map.items():

                for (start, end), time_label in zip(
                    windows,
                    time_labels
                ):

                    values = np.asarray(
                        X[i, start:end, channel_idx],
                        dtype=float
                    )

                    row[
                        f"{feature_name}_{time_label}"
                    ] = float(values.mean())

            rows.append(row)

        df = pd.DataFrame(rows)

        # Match BeeHave's original capitalization
        df.rename(
            columns={
                "HumidIn_13": "Humidin_13",
                "HumidIn_16": "Humidin_16",
                "HumidIn_19": "Humidin_19",
                "HumidIn_22": "Humidin_22"
            },
            inplace=True
        )

        return df


class BeeHaveTop29Selector(
    BaseEstimator,
    TransformerMixin
):

    def __init__(self, features=None):
        self.features = features

    def fit(self, X, y=None):
        return self

    def transform(self, X):

        if not isinstance(X, pd.DataFrame):
            X = pd.DataFrame(X)

        missing = [
            f for f in self.features
            if f not in X.columns
        ]

        if missing:
            raise ValueError(
                f"Missing selected features: {missing}"
            )

        return X[self.features]