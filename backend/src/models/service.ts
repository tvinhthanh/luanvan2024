import mongoose from "mongoose";
import { ServiceType } from "../shared/types";

const serviceSchema = new mongoose.Schema({
  // _id: {type: String, require: true, auto : true},
  name: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String }, // Ví dụ: "30 minutes", "1 hour"
  available: { type: Boolean, default: true }, // Trạng thái có sẵn
  time: { type: Number, default: 0 },
  id_vet: { type: String, ref: "Vet", required: true },
});

const Service = mongoose.model<ServiceType>(
  "service",
  serviceSchema,
  "service"
);

export default Service;
