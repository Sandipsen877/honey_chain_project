import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import KvicAdmin from "../models/KvicAdmin.js";
import LabReport from "../models/LabReport.js";
import Batch from "../models/Batch.js";
import Farm from "../models/Farm.js";
import Hive from "../models/Hive.js";
import { requireKvicAuth } from "../middleware/kvicAuth.js";

const router = express.Router();

/* ------------------------------------------------------------------ *
 * Auth - separate from keeper phone/OTP login (src/routes/authRoutes.js).
 * Registration is gated by KVIC_ADMIN_INVITE_CODE (.env) so random users
 * can't self-register as an admin.
 * ------------------------------------------------------------------ */

// POST /api/kvic/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;
    if (!name || !email || !password || !inviteCode) {
      return res.status(400).json({ error: "name, email, password, inviteCode are all required" });
    }
    if (!process.env.KVIC_ADMIN_INVITE_CODE || inviteCode !== process.env.KVIC_ADMIN_INVITE_CODE) {
      return res.status(403).json({ error: "Invalid invite code" });
    }

    const existing = await KvicAdmin.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "An admin with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await KvicAdmin.create({ name, email: email.toLowerCase(), passwordHash });

    res.status(201).json({ id: admin._id, name: admin.name, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/kvic/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password are required" });

    const admin = await KvicAdmin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: "kvic_admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------------------------------------------------------ *
 * Farms & batches - context an admin needs while writing a report.
 * ------------------------------------------------------------------ */

// GET /api/kvic/farms - every farm, with keeper contact info
router.get("/farms", requireKvicAuth, async (req, res) => {
  const farms = await Farm.find().populate("keeper", "name phone keeperCode email").sort({ createdAt: -1 });
  res.json(farms);
});

// GET /api/kvic/farms/:farmId - farm + keeper + its hives + its batches
router.get("/farms/:farmId", requireKvicAuth, async (req, res) => {
  const farm = await Farm.findById(req.params.farmId).populate("keeper", "name phone keeperCode email");
  if (!farm) return res.status(404).json({ error: "Farm not found" });

  const [hives, batches] = await Promise.all([
    Hive.find({ farm: farm._id }),
    Batch.find({ farm: farm._id }).sort({ createdAt: -1 }),
  ]);

  res.json({ farm, hives, batches });
});

// GET /api/kvic/batches?status= - every batch, farm + keeper populated
router.get("/batches", requireKvicAuth, async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const batches = await Batch.find(filter)
    .populate({ path: "farm", populate: { path: "keeper", select: "name phone keeperCode" } })
    .sort({ createdAt: -1 });
  res.json(batches);
});

/* ------------------------------------------------------------------ *
 * Lab reports - real, KVIC-verified (isMock: false), separate from the
 * simulated ones mockLabService.js generates.
 * ------------------------------------------------------------------ */

// POST /api/kvic/reports/:batchId - file a real lab-tested report for a batch
router.post("/reports/:batchId", requireKvicAuth, async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const { overallResult } = req.body;
    if (!["pass", "fail"].includes(overallResult)) {
      return res.status(400).json({ error: "overallResult must be 'pass' or 'fail'" });
    }

    const reportFields = {
      batch: batchId,
      labName: req.body.labName || "KVIC Regional Testing Lab",
      sampleId: req.body.sampleId,
      testedDate: req.body.testedDate ? new Date(req.body.testedDate) : new Date(),
      moisturePct: req.body.moisturePct,
      hmfMgPerKg: req.body.hmfMgPerKg,
      reducingSugarPct: req.body.reducingSugarPct,
      sucrosePct: req.body.sucrosePct,
      fructoseGlucoseRatio: req.body.fructoseGlucoseRatio,
      c4SugarTestResult: req.body.c4SugarTestResult || "not_tested",
      diastaseActivity: req.body.diastaseActivity,
      pollenFloralSource: req.body.pollenFloralSource,
      overallResult,
      isMock: false,
      verifiedBy: req.kvicAuth.adminId,
    };

    const report = await LabReport.create(reportFields);

    batch.status = "tested";
    await batch.save();

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/kvic/reports?overallResult=pass|fail - every real report filed via this dashboard
router.get("/reports", requireKvicAuth, async (req, res) => {
  const filter = { isMock: false };
  if (req.query.overallResult) filter.overallResult = req.query.overallResult;
  const reports = await LabReport.find(filter)
    .populate({
      path: "batch",
      populate: { path: "farm", populate: { path: "keeper", select: "name phone keeperCode" } },
    })
    .populate("verifiedBy", "name email")
    .sort({ createdAt: -1 });
  res.json(reports);
});

// GET /api/kvic/reports/:batchId/history - every real report ever filed for one batch
router.get("/reports/:batchId/history", requireKvicAuth, async (req, res) => {
  const reports = await LabReport.find({ batch: req.params.batchId, isMock: false })
    .populate("verifiedBy", "name email")
    .sort({ createdAt: -1 });
  res.json(reports);
});

export default router;
