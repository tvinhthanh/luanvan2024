import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  userID: { type: String, ref: 'User', required: true },
  pet: { type: String, ref: 'Pet', required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true, enum: ['open', 'closed', 'pending'] }
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

export default MedicalRecord;
