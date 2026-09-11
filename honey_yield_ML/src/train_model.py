from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
MODEL_DIR = ROOT / 'model'
MODEL_DIR.mkdir(exist_ok=True)

DATE = 'Date'
TARGET = 'Honey Weight (kg)'
EXTRACTION = 'Extract Honey'
ENV = {
    'Environmental Temperature (°C)': 'env_temp',
    'Relative Humidity (%)': 'env_humidity',
    'Hive Temperature (°C)': 'hive_temp',
    'Hive Humidity (%)': 'hive_humidity',
    'Wind Speed (km/h)': 'wind_speed',
}


def load_csv(path):
    df = pd.read_csv(path)
    df[DATE] = pd.to_datetime(df[DATE], errors='coerce')
    for c in list(ENV) + [TARGET]:
        df[c] = pd.to_numeric(df[c], errors='coerce')
    df[EXTRACTION] = df[EXTRACTION].astype(str).str.lower().isin(['true','1','yes'])
    return df.sort_values(DATE).reset_index(drop=True)


def prepare(df, make_target=True):
    d = df.copy().sort_values(DATE).reset_index(drop=True)
    # Deliberately do NOT use Total Weight: it is a deterministic transform of target in these files.
    # Extraction is used only through a backward-looking feature.
    d['days_since_last_extraction'] = np.nan
    last = None
    for i, row in d.iterrows():
        if bool(row[EXTRACTION]):
            last = row[DATE]
            d.loc[i, 'days_since_last_extraction'] = 0.0
        elif last is not None:
            d.loc[i, 'days_since_last_extraction'] = (row[DATE] - last).days
    d['days_since_last_extraction'] = d['days_since_last_extraction'].fillna(999.0)

    # Past-only target history features.
    for lag in [1, 3, 7, 14]:
        d[f'honey_lag{lag}'] = d[TARGET].shift(lag)
    d['honey_roll_mean_7'] = d[TARGET].shift(1).rolling(7, min_periods=1).mean()
    d['honey_roll_std_7'] = d[TARGET].shift(1).rolling(7, min_periods=2).std().fillna(0)
    d['honey_roll_mean_14'] = d[TARGET].shift(1).rolling(14, min_periods=1).mean()
    d['honey_diff_1'] = d[TARGET].shift(1).diff(1)

    # Current and backward environmental context.
    feature_cols = []
    for src, short in ENV.items():
        d[short] = d[src]
        feature_cols.append(short)
        d[f'{short}_roll7'] = d[src].shift(1).rolling(7, min_periods=1).mean()
        feature_cols.append(f'{short}_roll7')

    # Calendar seasonality.
    d['doy_sin'] = np.sin(2 * np.pi * d[DATE].dt.dayofyear / 365.25)
    d['doy_cos'] = np.cos(2 * np.pi * d[DATE].dt.dayofyear / 365.25)
    d['month'] = d[DATE].dt.month

    base = [
        'honey_lag1','honey_lag3','honey_lag7','honey_lag14',
        'honey_roll_mean_7','honey_roll_std_7','honey_roll_mean_14','honey_diff_1',
        'days_since_last_extraction', 'doy_sin','doy_cos','month'
    ]
    features = base + feature_cols

    if make_target:
        d['target_7d'] = d[TARGET].shift(-7)
        d = d.dropna(subset=features + ['target_7d']).reset_index(drop=True)
    else:
        d = d.dropna(subset=features).reset_index(drop=True)
    return d, features


def metrics(y, p):
    mape = np.mean(np.abs((y - p) / np.maximum(np.abs(y), 1e-6))) * 100
    return {'MAE_kg': mean_absolute_error(y,p), 'RMSE_kg': mean_squared_error(y,p)**0.5, 'R2': r2_score(y,p), 'MAPE_percent': mape}


def main():
    ideal23 = load_csv(DATA / 'Honey_Production_Dataset_2023.csv')
    ideal24 = load_csv(DATA / 'Honey_Production_Dataset_2024_Ideal.csv')
    nonideal = load_csv(DATA / 'Honey_Production_Dataset_2024_NonIdeal.csv')
    combined = pd.concat([ideal23, ideal24], ignore_index=True).sort_values(DATE).reset_index(drop=True)
    full, features = prepare(combined, True)

    split = int(len(full) * 0.80)
    train, test = full.iloc[:split], full.iloc[split:]
    X_train, y_train = train[features], train['target_7d']
    X_test, y_test = test[features], test['target_7d']

    # Simple persistence baseline: current honey weight as 7-day forecast.
    baseline = train[TARGET].iloc[:0]  # only to keep code explicit
    baseline_pred = test[TARGET].values

    models = {
        'linear_regression': LinearRegression(),
        'random_forest': RandomForestRegressor(
            n_estimators=500, max_depth=None, min_samples_leaf=1,
            random_state=42, n_jobs=-1
        ),
    }
    try:
        from xgboost import XGBRegressor
        models['xgboost'] = XGBRegressor(
            n_estimators=500, max_depth=5, learning_rate=0.03,
            subsample=0.9, colsample_bytree=0.9, objective='reg:squarederror',
            random_state=42, n_jobs=-1
        )
    except Exception:
        pass

    results = {'persistence_baseline': metrics(y_test, baseline_pred)}
    fitted = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        fitted[name] = model
        results[name] = metrics(y_test, model.predict(X_test))

    # Honest out-of-domain evaluation on non-ideal 2024. Fit only on the ideal training data.
    ood, _ = prepare(nonideal, True)
    ood_results = {}
    for name, model in fitted.items():
        ood_results[name] = metrics(ood['target_7d'], model.predict(ood[features]))

    best_name = min((n for n in fitted), key=lambda n: results[n]['MAE_kg'])
    best = fitted[best_name]
    bundle = {'model': best, 'features': features, 'horizon_days': 7,
              'target': TARGET, 'model_name': best_name,
              'note': 'Prototype trained on synthetic honey-production data.'}
    joblib.dump(bundle, MODEL_DIR / 'honey_yield_model.joblib')

    importance = None
    if hasattr(best, 'feature_importances_'):
        importance = dict(sorted(zip(features, best.feature_importances_), key=lambda x: x[1], reverse=True))

    report = {
        'target': TARGET, 'horizon_days': 7,
        'training_sources': ['Honey_Production_Dataset_2023.csv','Honey_Production_Dataset_2024_Ideal.csv'],
        'out_of_domain_source': 'Honey_Production_Dataset_2024_NonIdeal.csv',
        'train_rows': len(train), 'test_rows': len(test), 'ood_rows': len(ood),
        'features': features, 'models': results, 'out_of_domain': ood_results,
        'best_model': best_name, 'feature_importance': importance,
        'excluded_columns': ['Total Weight (Hive + Bees + Honey) (kg)', EXTRACTION + ' (future value)']
    }
    (MODEL_DIR / 'training_report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    main()
