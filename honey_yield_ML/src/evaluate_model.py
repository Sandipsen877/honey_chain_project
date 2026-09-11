from pathlib import Path
import json
import pandas as pd
from train_model import load_csv, prepare, metrics, DATA
import joblib

ROOT = Path(__file__).resolve().parents[1]
bundle = joblib.load(ROOT/'model/honey_yield_model.joblib')
print('Model:', bundle['model_name'])
print('Forecast horizon:', bundle['horizon_days'], 'days')
print('Features:', len(bundle['features']))
print('Training report:')
print(json.dumps(json.loads((ROOT/'model/training_report.json').read_text()), indent=2))
