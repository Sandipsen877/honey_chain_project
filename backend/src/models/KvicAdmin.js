import mongoose from "mongoose";
const { Schema } = mongoose;

const KvicAdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "kvic_admin" },
  },
  { timestamps: true }
);

export default mongoose.model("KvicAdmin", KvicAdminSchema);
