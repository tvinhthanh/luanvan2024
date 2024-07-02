import mongoose from "mongoose";

const vetSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  service: [{ type: [String],ref: 'service' ,required: false }],
  user_id: { type: String, required: true, ref : 'user' },
  createdAt: { type: Date, default: Date.now },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true, default: Date.now },
  booking: {type : [String], require: false},
});

const Vet = mongoose.model("vet", vetSchema, "vetC");
export default Vet;
