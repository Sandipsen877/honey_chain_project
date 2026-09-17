from pathlib import Path
from ultralytics import YOLO
import joblib
import sys

from app.beehave_features import (
    BeeHaveEnvironmentalFeatureEngineering,
    BeeHaveTop29Selector,
)

sys.modules["__main__"].BeeHaveEnvironmentalFeatureEngineering = (
    BeeHaveEnvironmentalFeatureEngineering
)

sys.modules["__main__"].BeeHaveTop29Selector = (
    BeeHaveTop29Selector
)


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


def load_models():
    hive_1_model = joblib.load(MODEL_DIR / "hive_1_isolation_forest.joblib")
    hive_2_model = joblib.load(MODEL_DIR / "hive_2_isolation_forest.joblib")
    varroa_model = YOLO(str(MODEL_DIR / "best.pt"))
    yield_bundle = joblib.load(MODEL_DIR / "honey_yield_model.joblib")
    beehave_pipeline = joblib.load(MODEL_DIR / "BeeHave_Environmental_Pipeline.pkl")
    return {
        "HIVE_01": hive_1_model,
        "HIVE_02": hive_2_model,
        "VARROA": varroa_model,
        "YIELD": yield_bundle,
        "BEEHAVE": beehave_pipeline
    }
'''
from pathlib import Path
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


def load_model(filename):
    path = MODEL_DIR / filename

    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found: {path}"
        )

    return joblib.load(path)


def load_models():

    hive_1_model = load_model(
        "hive_1_isolation_forest.joblib"
    )

    hive_2_model = load_model(
        "hive_2_isolation_forest.joblib"
    )

    return {
        "HIVE_01": hive_1_model,
        "HIVE_02": hive_2_model
    }'''