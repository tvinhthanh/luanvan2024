import mongoose from "mongoose";

const vetSchema = new mongoose.Schema({
  _id: { type: String, required: false },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  type: {type: Boolean, required: true, default: false},
  service: [{ type: String, ref: "Service", required: false }],
  user_id: { type: String, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true, default: Date.now },
  booking: [{ type: String, ref: "Booking", required: false }],
  record: [{ type: String, ref: "Medic", required: false }],
  medications: [{ type: String, ref: "Medication", required: false }],
});

const Vet = mongoose.model("vet", vetSchema, "vetC");
export default Vet;
