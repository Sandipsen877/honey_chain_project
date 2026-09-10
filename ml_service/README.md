# 🐝 Honey Chain — ML Service

The **Honey Chain ML Service** is the machine-learning and hive-intelligence component of the Honey Chain project.

It is a Python-based **FastAPI microservice** responsible for analyzing bee-hive sensor data, detecting abnormal hive conditions, calculating hive health scores, and returning structured health predictions to the main Node.js backend.

The ML service is designed to work as an internal service within the Honey Chain system.

---

## 📌 Purpose

The objective of this service is to transform raw hive sensor readings into meaningful hive-health information.

The service combines:

- 🌡️ Temperature monitoring
- 💧 Humidity monitoring
- 🫧 CO₂ monitoring
- 🧪 TVOC monitoring
- 💡 Light monitoring
- 🐝 Bee activity monitoring
- 📈 Time-series feature engineering
- 🤖 Isolation Forest anomaly detection
- ❤️ Rule-based hive health scoring
- 🚨 Inspection-required alerts

The final system classifies hive conditions into:

- **Healthy**
- **Warning**
- **Critical**

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     Bee Hive        │
                    │                     │
                    │ ESP32 + Sensors     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js Backend   │
                    │      Express        │
                    └──────────┬──────────┘
                               │
                         Sensor Data
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI ML        │
                    │      Service        │
                    │                     │
                    │ Feature Engineering │
                    │         ↓           │
                    │ Isolation Forest    │
                    │         ↓           │
                    │ Health Engine       │
                    └──────────┬──────────┘
                               │
                       Health Prediction
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js Backend   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Dashboard   │
                    │                     │
                    │ Health • Alerts     │
                    │ Analytics • Reports │
                    └─────────────────────┘