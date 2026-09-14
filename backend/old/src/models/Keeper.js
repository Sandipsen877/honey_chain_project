import mongoose from "mongoose";
const { Schema } = mongoose;

const KeeperSchema = new Schema(
  {
    keeperCode: { type: String, required: true, unique: true }, // e.g. KPR-0001
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Keeper", KeeperSchema);
