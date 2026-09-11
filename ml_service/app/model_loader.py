from pathlib import Path
from ultralytics import YOLO
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


def load_models():
    hive_1_model = joblib.load(MODEL_DIR / "hive_1_isolation_forest.joblib")
    hive_2_model = joblib.load(MODEL_DIR / "hive_2_isolation_forest.joblib")

    return {
        "VARROA": YOLO(str(MODEL_DIR / "best.pt")),
        "HIVE_01": hive_1_model,
        "HIVE_02": hive_2_model
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