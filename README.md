# 🍯 HoneyChain

> **A digital honey traceability and smart beekeeping platform that connects hive intelligence, AI-assisted monitoring, honey-batch provenance, QR verification, and an administrative ecosystem in one workflow.**

<p align="center">
  <img src="assets/01_landing_page.png" alt="HoneyChain Landing Page" width="900"/>
</p>

<p align="center">
  <strong>From hive → harvest → quality → digital passport → consumer verification.</strong>
</p>

---

## ✨ What is HoneyChain?

HoneyChain is an end-to-end prototype designed around two connected problems in modern beekeeping:

1. **Hive productivity and colony monitoring** — helping beekeepers understand hive conditions, receive alerts, inspect possible Varroa infestations, and estimate near-term honey yield.
2. **Honey provenance and consumer trust** — connecting a harvested batch to its farm, laboratory report, QR code, and public-facing digital passport.

Instead of treating beekeeping analytics and honey traceability as separate systems, HoneyChain creates a single digital workflow:

```text
                         HONEYCHAIN
                             │
             ┌───────────────┴───────────────┐
             │                               │
      🐝 SMART BEEKEEPING              🍯 TRACEABILITY
             │                               │
       Farm / Hive Data                 Honey Batch
             │                               │
      Sensor Observations               Lab Report
             │                               │
       ┌─────┼─────┐                     QR Code
       │     │     │                       │
     Health Varroa Yield              Digital Passport
       │     │     │                       │
       └─────┴─────┘                       │
             │                             │
             └──────────────┬──────────────┘
                            ▼
                   TRUSTED HONEY JOURNEY
```

### Core capabilities

| Area | Capability |
|---|---|
| 🐝 Beekeeping | Keeper, farm and hive management |
| 📡 Monitoring | Sensor readings and hive observations |
| 🧠 AI/ML | Hive-health assessment, Varroa detection, yield forecasting |
| 🚨 Alerts | Health/inspection alerts and resolution workflow |
| 🍯 Production | Honey-batch creation and management |
| 🧪 Quality | Laboratory-report workflow |
| 🔳 Verification | QR generation and public batch scanning |
| 🪪 Provenance | Digital Honey Passport |
| 🏛️ Administration | Dedicated KVIC/admin portal |
| 🎨 UX | Responsive React dashboard with light/dark themes |

---

## 🏆 Why the architecture matters

HoneyChain is deliberately structured as a **modular system**, rather than a single monolithic application.

```text
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                React + Vite + Tailwind CSS                  │
│                                                              │
│  Keeper Portal │ Honey Passport │ Public QR │ KVIC Portal   │
└─────────────────────────────┬────────────────────────────────┘
                              │ REST API
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                    Node.js + Express                         │
│                                                              │
│ Auth │ Farms │ Hives │ Sensors │ Alerts │ Batches │ Lab │ QR│
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                ▼                              ▼
        ┌───────────────┐              ┌─────────────────┐
        │   MongoDB     │              │   ML SERVICE    │
        │               │              │     FastAPI     │
        │ Platform data │              │                 │
        └───────────────┘              │ Health Engine   │
                                       │ Varroa YOLO     │
                                       │ Yield Forecast  │
                                       └─────────────────┘
```

This separation makes the system easier to demonstrate, test, replace, and extend with real IoT devices, laboratory APIs, or a production blockchain layer.

---

# 🚀 Feature Overview

## 1. 🐝 Smart Beekeeping Dashboard

The beekeeper portal provides a centralized view of farms, hives, sensor information, alerts, batches, and productivity information.

### Farm management

- Create and view farms
- Associate farms with keepers
- View farm-level information
- Track associated hives

### Hive management

- Create and view hives
- Associate hives with farms
- Track hive observations
- Retrieve recent sensor readings

### Sensor monitoring

The backend supports sensor observations such as:

- Hive temperature
- Hive humidity
- Outside temperature
- Outside humidity
- Pressure
- CO₂
- TVOC
- Light
- Bee-in / bee-out activity

For demonstration purposes, the repository includes a **sensor simulator** that can generate synthetic readings and occasional anomalies.

> **Prototype note:** the simulator represents the IoT integration boundary. It can later be replaced by MQTT, LoRaWAN, a device gateway, or another real sensor ingestion layer.

---

# 🧠 Machine Learning & Intelligence Layer

HoneyChain keeps its ML workloads behind an independent **FastAPI service**, allowing the web application to call specialized inference APIs without coupling the frontend to model execution.

```text
                    ML SERVICE
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
     🕷️ Varroa     🍯 Yield      🩺 Hive Health
       YOLO        Forecast       Rule Engine
          │             │             │
          └─────────────┴─────────────┘
                        │
                        ▼
                  FastAPI REST API
```

## 🍯 Honey Yield Forecasting

Endpoint:

```http
POST /predict/yield
```

Model:

```text
ml_service/models/BeeHave_Environmental_Pipeline.pkl
```

The forecasting pipeline uses environmental observations inspired by the **BeeHave** dataset and a trained Random Forest pipeline.

```text
Environmental Observations
          │
          ▼
Feature Engineering
          │
          ▼
Feature Selection
          │
          ▼
Random Forest Pipeline
          │
          ▼
7-Day Forecast
```

The current API expects **7 forecast days**, with **144 observations per day**.

```text
7 days × 144 readings/day
= 1,008 environmental observations
```

## 🕷️ Varroa Mite Detection

Endpoint:

```http
POST /predict/varroa
```

Model:

```text
ml_service/models/best.pt
```

The service accepts an image and runs the trained YOLO detector. The response is structured for the frontend to display detection count, confidence and bounding boxes.

Example response:

```json
{
  "status": "ok",
  "model_loaded": true,
  "detected": true,
  "count": 2,
  "detections": [
    {
      "class_id": 0,
      "class_name": "Varroa_mite",
      "confidence": 0.91,
      "bbox": {
        "x1": 120,
        "y1": 80,
        "x2": 165,
        "y2": 125
      }
    }
  ]
}
```

### Detection workflow

```text
Bee Image
   │
   ▼
YOLO Inference
   │
   ├── Class
   ├── Confidence
   └── Bounding Box
   │
   ▼
Frontend Visualization
```

---

## 🩺 Hive Health Assessment — Final ML Component

> **This section intentionally appears last in the ML chapter because the current hive-health implementation is a transparent rule-based engine rather than a trained ML model.**

Endpoint:

```http
POST /predict/health
```

The health engine evaluates measurable hive and environmental signals such as:

- Temperature
- Humidity
- CO₂
- TVOC
- Bee activity
- Outside temperature and humidity
- Pressure
- Light

It returns:

```text
Health Score
Health Status
Bee Activity
Bee Flow
Risk Factors
Recommendations
Inspection Required
```

### Why rule-based?

For the current prototype, the priority is **interpretability and predictable behaviour**. A beekeeper or judge can trace a recommendation back to measurable sensor conditions instead of receiving an unexplained black-box score.

```text
Sensor Observations
        │
        ▼
Threshold / Risk Rules
        │
        ├── Temperature Risk
        ├── Humidity Risk
        ├── Gas / Air Risk
        ├── Activity Risk
        └── Environmental Risk
        │
        ▼
Health Score + Status
        │
        ├── Risk Factors
        ├── Recommendations
        └── Inspection Flag
```

**Important:** this component should not be described as a trained predictive ML model in presentations or documentation. It is the project's explainable **rule-based health engine**.

# 🍯 Honey Traceability

HoneyChain models a honey batch as a digital object that can move through a traceability workflow.

```text
Farm
  │
  ▼
Harvest Batch
  │
  ▼
Laboratory Submission
  │
  ▼
Lab Report
  │
  ▼
QR Generation
  │
  ▼
Public Verification
  │
  ▼
Digital Honey Passport
```

## Batch management

The platform supports:

- Batch creation
- Farm association
- Batch details
- Batch updates
- Batch listing and filtering

## Laboratory workflow

The current prototype includes a lab-service abstraction.

For demonstrations, laboratory processing is simulated so the complete workflow can run without external laboratory infrastructure.

> The service boundary is intentionally replaceable: a production deployment can connect the same workflow to a real laboratory API.

---

# 🔳 QR Verification

Each eligible honey batch can receive a QR code.

The QR workflow is designed around a simple consumer journey:

```text
Consumer scans QR
       │
       ▼
Public batch page
       │
       ├── Batch identity
       ├── Origin / farm information
       ├── Quality information
       ├── Laboratory information
       └── Traceability / passport details
```

Public scanning is exposed through:

```http
GET /api/qr/scan/:batchId
```

This allows consumers to verify a batch without needing beekeeper credentials.

---

# 🪪 Digital Honey Passport

The Honey Passport provides a structured representation of a honey batch's provenance.

The frontend includes dedicated passport screens for:

- Batch identity
- Origin
- Traceability information
- Quality-related records
- Public verification

The architecture is also suitable for extending the passport with cryptographic proofs or a production blockchain ledger.

> **Important:** the current repository should be understood as a blockchain-oriented traceability prototype; the inspected codebase does not contain a full production blockchain network/smart-contract implementation. The QR/database provenance layer is the current working traceability mechanism.

---

# 🏛️ KVIC / Administration Portal

HoneyChain includes a separate administrative portal with its own authentication flow.

The administrative interface includes:

- Admin registration
- Admin login
- Dashboard
- Batch management
- Batch details
- Farm management
- Reports

This creates a clear separation between:

```text
Beekeeper / Producer
        │
        ▼
Productivity + Hive Management

KVIC / Administrator
        │
        ▼
Oversight + Batch / Farm Management

Consumer
        │
        ▼
Public QR Verification
```

---

# 🛠️ Technology Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Three.js
- React Three Fiber
- React Three Drei

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios
- Multer
- QRCode
- Cloudinary integration
- node-cron

### ML Service

- Python
- FastAPI
- Pydantic
- NumPy
- Pandas
- Scikit-learn
- Joblib
- Ultralytics YOLO
- Pillow

---

# 📁 Repository Structure

```text
honey_chain_project-main/
│
├── assets/                         # Product screenshots
│
├── frontend/                       # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   │   └── kvic/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                        # Node/Express API
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── ml_service/                    # FastAPI ML microservice
│   ├── app/
│   │   ├── main.py
│   │   ├── health_engine.py
│   │   ├── model_loader.py
│   │   └── beehave_features.py
│   ├── models/
│   │   ├── best.pt
│   │   └── BeeHave_Environmental_Pipeline.pkl
│   ├── notebooks/
│   │   ├── hive_yield.ipynb
│   │   └── varroa_training.ipynb
│   └── requirements.txt
│
└── README.md
```

---

# 🔌 API Surface

## Backend

| Module | Endpoint examples | Purpose |
|---|---|---|
| Auth | `/api/auth/*` | OTP/JWT authentication |
| Keepers | `/api/keepers/*` | Keeper management |
| Farms | `/api/farms/*` | Farm management |
| Hives | `/api/hives/*` | Hive management |
| Sensors | `/api/sensors/*` | Sensor observations |
| Alerts | `/api/alerts/*` | Health/inspection alerts |
| Yield | `/api/yield/*` | Yield and disease-risk workflows |
| Batches | `/api/batches/*` | Honey batch management |
| Lab | `/api/lab/*` | Laboratory workflow |
| QR | `/api/qr/*` | QR generation/scanning |
| KVIC | `/api/kvic/*` | Administrative portal |

## ML Service

| Endpoint | Method | Purpose |
|---|---:|---|
| `/` | GET | ML service status |
| `/predict/health` | POST | Hive health assessment |
| `/predict/varroa` | POST | Varroa image detection |
| `/health/varroa` | GET | Varroa model status |
| `/predict/yield` | POST | 7-day yield/weight forecast |

Interactive FastAPI documentation is available at:

```text
http://localhost:8000/docs
```

---

# ⚙️ Local Development

## Prerequisites

Install:

- Node.js 18+
- Python 3.10+
- MongoDB 6+ or MongoDB Atlas
- Git

A CUDA-capable GPU is useful for faster YOLO inference, but the API architecture itself does not require one.

---

## 1. Clone the project

```bash
git clone <your-repository-url>
cd honey_chain_project-main
```

---

## 2. Start MongoDB

Use either:

- Local MongoDB
- MongoDB Atlas

The backend defaults to:

```text
mongodb://127.0.0.1:27017/beekeeping_prototype
```

For production-like usage, provide a MongoDB connection string through `MONGO_URI`.

---

## 3. Start the ML service

```bash
cd ml_service

python -m venv venv
```

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

Start FastAPI:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Verify:

```text
http://localhost:8000/
```

Swagger:

```text
http://localhost:8000/docs
```

---

## 4. Start the backend

Open a second terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/beekeeping_prototype

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=30d

ML_SERVICE_URL=http://127.0.0.1:8000
YIELD_ML_SERVICE_URL=http://127.0.0.1:8000

SIMULATOR_ENABLED=true
SIMULATOR_INTERVAL_CRON=*/2 * * * *
```

Start:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/
```

---

## 5. Start the frontend

Open a third terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend URL, normally:

```text
http://localhost:5173
```

If required, configure:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

# 🔄 End-to-End Demo Flow

For a strong project demonstration, follow this sequence:

```text
1. Register beekeeper
          ↓
2. Verify OTP
          ↓
3. Create farm
          ↓
4. Create hive(s)
          ↓
5. Generate / ingest sensor readings
          ↓
6. Run hive-health assessment
          ↓
7. Demonstrate alert / inspection recommendation
          ↓
8. Upload bee image for Varroa detection
          ↓
9. Run 7-day honey-yield forecast
          ↓
10. Create honey batch
          ↓
11. Submit batch for laboratory workflow
          ↓
12. Generate QR
          ↓
13. Scan QR as a public consumer
          ↓
14. Open Digital Honey Passport
          ↓
15. Review batch/farm data in KVIC portal
```

This sequence demonstrates the project's **full vertical integration**, rather than showing isolated screens.

---

# 🧪 Model & Data Notes

## Honey Yield

Required contract:

```text
7 forecast days
×
144 readings per day
```

The serialized model:

```text
ml_service/models/BeeHave_Environmental_Pipeline.pkl
```

depends on the custom feature-engineering implementation:

```text
ml_service/app/beehave_features.py
```

Keep both available when loading the model.

## Varroa

The deployed detector is:

```text
ml_service/models/best.pt
```

Class mapping is exposed by the model API.

## Hive Health

The health engine is:

```text
ml_service/app/health_engine.py
```

It is intentionally transparent and does not require a trained model artifact.

---

# 🖼️ Product Experience

The repository contains a large screenshot set. The README uses the screenshots as a visual product tour so visitors can understand the platform before reading the implementation details. GitHub supports repository-relative image paths, making these images portable when the repository is cloned. citeturn0search2turn0search8

## 🌐 Public & Authentication

<p align="center">
  <img src="assets/01_landing_page.png" alt="HoneyChain landing page." width="48%"/>
  <img src="assets/02_login_page.png" alt="HoneyChain login page." width="48%"/>
</p>

<p align="center">
  <img src="assets/03_create_account.png" alt="HoneyChain account creation page." width="48%"/>
  <img src="assets/11_learn_beekeeping.png" alt="HoneyChain beekeeping learning page." width="48%"/>
</p>

## 🐝 Beekeeper Workspace

<p align="center">
  <img src="assets/04_beekeeper_dashboard.png" alt="Beekeeper dashboard showing hive and farm information." width="80%"/>
</p>

<p align="center">
  <img src="assets/06_active_alerts.png" alt="Active alerts available to the beekeeper." width="48%"/>
  <img src="assets/12_beekeeper_dashboard_dark.png" alt="Beekeeper dashboard in dark theme." width="48%"/>
</p>

## 🍯 Honey & Traceability

<p align="center">
  <img src="assets/08_honey_batches.png" alt="Honey batch management interface." width="48%"/>
  <img src="assets/13_honey_batches_dark.png" alt="Honey batch management in dark theme." width="48%"/>
</p>

<p align="center">
  <img src="assets/09_digital_passport.png" alt="Digital Honey Passport interface." width="48%"/>
  <img src="assets/14_digital_passport_dark.png" alt="Digital Honey Passport in dark theme." width="48%"/>
</p>

<p align="center">
  <img src="assets/15_honey_passport_details.png" alt="Detailed Honey Passport information for a batch." width="80%"/>
</p>

## 🔳 Consumer Verification

<p align="center">
  <img src="assets/10_batch_verification.png" alt="Public honey batch verification page." width="80%"/>
</p>

## 🏛️ KVIC Administration

<p align="center">
  <img src="assets/16_admin_registration.png" alt="KVIC administrator registration interface." width="48%"/>
  <img src="assets/17_admin_login.png" alt="KVIC administrator login interface." width="48%"/>
</p>

<p align="center">
  <img src="assets/18_admin_dashboard.png" alt="KVIC administration dashboard." width="80%"/>
</p>

<p align="center">
  <img src="assets/19_batch_management.png" alt="KVIC batch management interface." width="48%"/>
  <img src="assets/20_batch_details.png" alt="KVIC batch details interface." width="48%"/>
</p>

<p align="center">
  <img src="assets/21_farm_management.png" alt="KVIC farm management interface." width="80%"/>
</p>

## 🩺 Hive Health — Final ML Screen

The rule-based hive-health screen is intentionally shown last in the product gallery, matching its position at the end of the ML section.

<p align="center">
  <img src="assets/05_hive_health.png" alt="Hive health assessment screen showing health insights and recommendations." width="80%"/>
</p>

> **Documentation note:** screenshots are used to make the repository visually scannable while the surrounding text provides the corresponding technical context. citeturn0search1turn0search3

# 🔐 Security & Production Considerations

This repository is a prototype/demo system. Before production deployment:

- Move all secrets to a secure secret manager.
- Use HTTPS/TLS for every externally accessible service.
- Rotate JWT secrets and avoid weak development credentials.
- Add rate limiting to authentication and public endpoints.
- Replace console-based OTP delivery with a verified SMS provider.
- Add stronger role-based access control and audit logging.
- Validate and sanitize all uploaded images and user-provided data.
- Restrict CORS to trusted origins.
- Add MongoDB authentication and network controls.
- Add structured application logging and monitoring.
- Store uploaded assets securely.
- Add model versioning and model-performance monitoring.
- Replace simulated IoT and lab integrations with authenticated production services.
- If a blockchain ledger is deployed, define transaction identity, immutability, key management, and on-chain/off-chain data boundaries explicitly.

---

# 🧭 Current Prototype Boundaries

HoneyChain intentionally uses simulation at several integration points so that the complete product can be demonstrated without physical infrastructure.

| Component | Current implementation | Production evolution |
|---|---|---|
| Hive sensors | Synthetic sensor simulator | MQTT / LoRaWAN / gateway |
| OTP | Console/mock delivery | SMS provider |
| Laboratory | Simulated workflow | Real lab API |
| Hive health | Rule-based engine | Validated ML/clinical-style risk model |
| Varroa | YOLO inference | Edge/mobile/stream inference |
| Honey yield | Random Forest pipeline | Continuous retraining + real farm data |
| Traceability | MongoDB + QR + digital passport | Blockchain/ledger integration where required |

This distinction is important: **the prototype demonstrates the complete product workflow without pretending that simulated infrastructure is already a production integration.**

---

# 🗺️ Roadmap

### Phase 1 — Prototype
- [x] React beekeeper interface
- [x] Node/Express backend
- [x] MongoDB data layer
- [x] Hive/farm management
- [x] Sensor simulation
- [x] Hive health engine
- [x] Varroa YOLO service
- [x] Honey-yield forecasting service
- [x] Honey batches
- [x] Lab workflow
- [x] QR verification
- [x] Digital Honey Passport
- [x] KVIC/admin portal

### Phase 2 — Real-world integration
- [ ] Real IoT ingestion
- [ ] MQTT/LoRaWAN gateway
- [ ] Real SMS OTP
- [ ] Real laboratory integration
- [ ] Production object storage
- [ ] Model monitoring
- [ ] Automated model retraining

### Phase 3 — Trust infrastructure
- [ ] Cryptographic batch identity
- [ ] Tamper-evident provenance
- [ ] Smart-contract/ledger integration
- [ ] On-chain verification proofs
- [ ] Consumer-facing authenticity analytics

---

# 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

For meaningful changes, include:

- What changed
- Why it changed
- How it was tested
- Any API/schema changes
- Screenshots for UI changes

---

# 📄 License

Add the project's intended license here before public distribution.

For academic/hackathon submission, also consider adding:

- Team members
- Institution
- Problem statement
- Dataset acknowledgements
- Model/dataset licenses
- Third-party attribution

---

---

## ⭐ Project at a Glance

```text
Frontend        → React / Vite / Tailwind
Backend         → Node.js / Express
Database        → MongoDB
ML API          → FastAPI
Computer Vision → YOLO
Yield Model     → Random Forest
Health Engine   → Explainable rule-based scoring
Traceability    → Batch + Lab + QR + Digital Passport
Admin           → KVIC Portal
```

### The core idea

> **Make the hive measurable, the honey traceable, and the journey verifiable.** 🍯🐝

---

<p align="center">
  <strong>HoneyChain</strong><br/>
  <sub>Smart Beekeeping • AI-Assisted Hive Intelligence • Honey Traceability • Consumer Trust</sub>
</p>
