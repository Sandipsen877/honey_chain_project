import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import { startSimulator } from "./src/services/sensorSimulator.js";
import keeperRoutes from "./src/routes/keeperRoutes.js";
import farmRoutes from "./src/routes/farmRoutes.js";
import hiveRoutes from "./src/routes/hiveRoutes.js";
import sensorRoutes from "./src/routes/sensorRoutes.js";
import alertRoutes from "./src/routes/alertRoutes.js";
import yieldRoutes from "./src/routes/yieldRoutes.js";
import batchRoutes from "./src/routes/batchRoutes.js";
import labRoutes from "./src/routes/labRoutes.js";
import qrRoutes from "./src/routes/qrRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  console.log("[server] health check");
  res.json({ status: "ok", service: "beekeeping-backend", mode: "prototype" });
});

// Auth (phone + OTP login, JWT issued per device)
app.use("/api/auth", authRoutes);

// Portal 1 - Productivity & Health Dashboard
app.use("/api/keepers", keeperRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/hives", hiveRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/yield", yieldRoutes);

// Portal 2 - Brand & QR Traceability
app.use("/api/batches", batchRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/qr", qrRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

(async () => {
  if (!process.env.JWT_SECRET) {
    console.warn("[server] WARNING: JWT_SECRET is not set - auth routes will fail. Set it in .env");
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] beekeeping-backend running on port http://localhost:${PORT}`);
    startSimulator();
  });
})();
