import mongoose from "mongoose";
import { ServiceType } from "../shared/types";

const serviceSchema = new mongoose.Schema({
  // _id: {type: String, require: true, auto : true},
  name: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String }, // Ví dụ: "30 minutes", "1 hour"
  available: { type: Boolean, default: true }, // Trạng thái có sẵn
  id_vet: {type: String, ref: 'vetC', required: true}
});

const Service = mongoose.model<ServiceType>("service", serviceSchema, "service");

export default Service;