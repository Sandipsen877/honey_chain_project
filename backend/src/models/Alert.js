import mongoose from "mongoose";
const { Schema } = mongoose;

const AlertSchema = new Schema(
  {
    hive: { type: Schema.Types.ObjectId, ref: "Hive", required: true },
    farm: { type: Schema.Types.ObjectId, ref: "Farm", required: true },
    type: {
      type: String,
      enum: ["temperature", "humidity", "weight_drop", "disease_risk", "varroa", "health_ml"],
      required: true,
    },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    message: { type: String, required: true },
    suggestedAction: { type: String },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
    sourceReading: { type: Schema.Types.ObjectId, ref: "SensorReading" },
    imageUrl: { type: String }, // most recent Varroa-detection photo, when type === "varroa"
    imagePublicId: { type: String },
    detections: [
  {
    classId: Number,
    className: String,
    confidence: Number,
    bbox: {
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
    },
  },
],},
  { timestamps: true }
);

export default mongoose.model("Alert", AlertSchema);
