import mongoose from "mongoose";

const vetSchema = new mongoose.Schema({
  _id: { type: String, required: false},
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  service: [{ type: [String],ref: 'service' ,required: false }],
  user_id: { type: String, required: true, ref : 'user' },
  createdAt: { type: Date, default: Date.now },
  description: {type: String, required: false },
  imageUrls: [{ type: String, required: false }],
  lastUpdated: { type: Date, required: true, default: Date.now },
  booking: [{type : [String],ref:'bookings', required: false}],
  medicalRecord: [{type:[String], ref:'medicalrecords', required: false}],
  record: [{type:[String], ref:'records', required: false}],
  medications: [{type:[String], ref:'medications', required: false}]
});

const Vet = mongoose.model("vet", vetSchema, "vetC");
export default Vet;
