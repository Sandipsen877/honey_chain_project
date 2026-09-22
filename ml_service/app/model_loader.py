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
    varroa_model = YOLO(str(MODEL_DIR / "best.pt"))
    yield_model = joblib.load(MODEL_DIR / "BeeHave_Environmental_Pipeline.pkl")
    return {
        "VARROA": varroa_model,
        "YIELD": yield_bundle,
        "BEEHAVE": beehave_pipeline
    }
