# Honey Chain — ML Service

The `ml_service` provides the machine-learning and hive-analysis APIs used by the Honey Chain application.

It provides three main capabilities:

1. **Honey Yield Prediction**
2. **Varroa Mite Detection**
3. **Hive Health Assessment**

---

# 1. Honey Yield Prediction

Honey yield prediction uses the **BeeHave environmental dataset and a trained Random Forest pipeline**.

The deployed model is:

```text
models/BeeHave_Environmental_Pipeline.pkl
```

### Processing

```text
BeeHave 144 × 40 Input
        │
        ▼
Environmental Feature Engineering
        │
        ▼
Top-29 Feature Selection
        │
        ▼
Random Forest Regressor
        │
        ▼
Honey Yield Prediction
```

The training workflow is documented in:

```text
notebook/hive_yield.ipynb
```

The serialized pipeline depends on the custom feature-engineering classes in:

```text
app/beehave_features.py
```

Therefore, `beehave_features.py` must remain available when loading the `.pkl` model.

---

# 2. Varroa Mite Detection

Varroa detection uses a **YOLO object-detection model**.

The trained model is:

```text
models/best.pt
```

The model detects:

```text
Varroa_mite
```

from uploaded bee/hive images.

### Processing

```text
Bee Image
    │
    ▼
YOLO Model
    │
    ▼
Varroa Mite Detection
    │
    ├── Bounding Box
    ├── Confidence
    └── Detection Class
```

The training workflow is documented in:

```text
notebook/varroa_training.ipynb
```

---

# 3. Hive Health Assessment

Hive health is currently implemented as a **rule-based scoring engine**, rather than a trained machine-learning model.

The implementation is located in:

```text
app/health_engine.py
```

It evaluates sensor observations such as:

* Hive temperature
* Hive humidity
* Outside temperature
* Outside humidity
* Pressure
* CO₂
* TVOC
* Light
* Bee activity (`bee_in`, `bee_out`)

### Processing

```text
Sensor Data
     │
     ▼
Health Engine
     │
     ├── Temperature analysis
     ├── Humidity analysis
     ├── Bee activity
     ├── CO₂ / TVOC analysis
     ├── Environmental comparison
     └── Change detection
     │
     ▼
Health Score
     │
     ▼
Health Status
```

The service returns the calculated health score, status, risk factors, and recommendations.

This component does **not require a trained model file**.

---

# API Endpoints

The FastAPI application is defined in:

```text
app/main.py
```

### Honey Yield

```http
POST /predict/yield
```

Predicts honey yield from the required BeeHave-style historical observations.

### Varroa Detection

```http
POST /predict/varroa
```

Runs YOLO-based Varroa mite detection on an uploaded image.

### Varroa Model Status

```http
GET /health/varroa
```

Checks whether the Varroa model is loaded.

### Hive Health

```http
POST /predict/health
```

Calculates hive health using the rule-based health engine.

### Service Status

```http
GET /
```

Returns the ML service status.

---

# Architecture

```text
                    Honey Chain Backend
                           │
                           ▼
                       ML Service
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
       Honey Yield      Varroa       Hive Health
        Prediction      Detection      Assessment
             │             │             │
             ▼             ▼             ▼
       Random Forest       YOLO       Rule Engine
       BeeHave Model      best.pt    health_engine.py
```

---

# Model Files

```text
models/
├── BeeHave_Environmental_Pipeline.pkl
└── best.pt
```

### `BeeHave_Environmental_Pipeline.pkl`

Random Forest pipeline used for honey-yield prediction.

### `best.pt`

YOLO model used for Varroa mite detection.

The Hive Health component does not use a model file because it is rule-based.

---

# Training Notebooks

```text
notebooks/
├── hive_yield.ipynb
└── varroa_training.ipynb
```

These notebooks document the training workflows for the two trained ML models.

---

# Technology Stack

* Python
* FastAPI
* Pydantic
* NumPy
* Pandas
* Scikit-learn
* Joblib
* Ultralytics YOLO
* Pillow

---

# Running the ML Service

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# Important Notes

* Keep `models/best.pt` for Varroa detection.
* Keep `models/BeeHave_Environmental_Pipeline.pkl` for honey-yield prediction.
* Keep `app/beehave_features.py` because the serialized BeeHave pipeline depends on its custom classes.
* Keep `app/health_engine.py` for the rule-based hive-health assessment.
* Do not rename or remove the API endpoints without updating the backend integration.
* Do not commit generated YOLO training directories such as `runs/`.
* The notebooks document model training; the running API uses the trained model files in `models/`.
