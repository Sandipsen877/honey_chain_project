from pathlib import Path
import joblib
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = joblib.load(ROOT / 'model' / 'honey_yield_model.joblib')
MODEL = BUNDLE['model']
FEATURES = BUNDLE['features']
TARGET = BUNDLE['target']

ENV = {
    'Environmental Temperature (°C)': 'env_temp',
    'Relative Humidity (%)': 'env_humidity',
    'Hive Temperature (°C)': 'hive_temp',
    'Hive Humidity (%)': 'hive_humidity',
    'Wind Speed (km/h)': 'wind_speed',
}

def build_features(history: pd.DataFrame) -> pd.DataFrame:
    d = history.copy()
    d['Date'] = pd.to_datetime(d['Date'])
    d = d.sort_values('Date').reset_index(drop=True)
    for c in ENV:
        d[c] = pd.to_numeric(d[c], errors='coerce')
    d[TARGET] = pd.to_numeric(d[TARGET], errors='coerce')
    d['Extract Honey'] = d['Extract Honey'].astype(str).str.lower().isin(['true','1','yes'])
    last = None
    vals = []
    for _, r in d.iterrows():
        if r['Extract Honey']:
            last = r['Date']
            vals.append(0.0)
        elif last is None:
            vals.append(999.0)
        else:
            vals.append((r['Date'] - last).days)
    d['days_since_last_extraction'] = vals
    for lag in [1,3,7,14]:
        d[f'honey_lag{lag}'] = d[TARGET].shift(lag)
    d['honey_roll_mean_7'] = d[TARGET].shift(1).rolling(7, min_periods=1).mean()
    d['honey_roll_std_7'] = d[TARGET].shift(1).rolling(7, min_periods=2).std().fillna(0)
    d['honey_roll_mean_14'] = d[TARGET].shift(1).rolling(14, min_periods=1).mean()
    d['honey_diff_1'] = d[TARGET].shift(1).diff(1)
    for src, short in ENV.items():
        d[short] = d[src]
        d[f'{short}_roll7'] = d[src].shift(1).rolling(7, min_periods=1).mean()
    d['doy_sin'] = np.sin(2*np.pi*d['Date'].dt.dayofyear/365.25)
    d['doy_cos'] = np.cos(2*np.pi*d['Date'].dt.dayofyear/365.25)
    d['month'] = d['Date'].dt.month
    row = d.iloc[[-1]]
    if row[FEATURES].isna().any().any():
        raise ValueError('Insufficient/invalid history: the latest row contains missing model features.')
    return row[FEATURES]

def predict_7_day(history: pd.DataFrame) -> float:
    """Predict honey weight 7 days after the latest supplied observation."""
    X = build_features(history)
    return float(MODEL.predict(X)[0])

if __name__ == '__main__':
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / 'data' / 'Honey_Production_Dataset_2024_Ideal.csv')
    history = pd.read_csv(path)
    print(f'7-day-ahead predicted honey weight: {predict_7_day(history):.2f} kg')
