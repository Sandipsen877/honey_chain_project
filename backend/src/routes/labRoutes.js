import express from "express";
const router = express.Router();
import Batch from "../models/Batch.js";
import LabReport from "../models/LabReport.js";

// POST /api/lab/submit/:batchId - mark a batch as submitted for lab testing.
// Status-only: no report is generated here. A KVIC admin later files the
// real result via POST /api/kvic/reports/:batchId, which moves the batch to
// "tested". (Previously this called mockLabService and auto-generated a
// random report after a delay - that's gone now.)
router.post("/submit/:batchId", async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.batchId);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    batch.status = "submitted_for_testing";
    await batch.save();

    res.status(202).json({ status: batch.status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/lab/report/:batchId - fetch the latest report for a batch.
// Only real, KVIC-admin-filed reports exist now, so this is equivalent to
// GET /api/kvic/reports/:batchId/history[0], just without requiring admin auth.
router.get("/report/:batchId", async (req, res) => {
  const report = await LabReport.findOne({ batch: req.params.batchId }).sort({ createdAt: -1 });
  if (!report) return res.status(404).json({ error: "Report not ready or not found yet" });
  res.json(report);
});

// GET /api/lab/report/:batchId/history - every report ever filed for this batch
router.get("/report/:batchId/history", async (req, res) => {
  const reports = await LabReport.find({ batch: req.params.batchId }).sort({ createdAt: -1 });
  res.json(reports);
});

export default router;