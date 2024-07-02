import mongoose, { Schema, Document } from "mongoose";

const MedicSchema: Schema = new Schema({
  petId: { type: String, ref: 'Pet', required: true },
  ownerId: { type: String, ref: 'Owner', required: true },
  vetId: { type: String, ref: 'Vet', required: true },
  visitDate: { type: Date, required: true },
  reasonForVisit: { type: String, required: true },
  symptoms: { type: String, required: true },//triệu chứng
  diagnosis: { type: String, required: true },//chuẩn đoán
  treatmentPlan: { type: String, required: true },//kế hoạch khám
  notes: { type: String } //ghi chú
}, { timestamps: true });

const Medic = mongoose.model('Medic', MedicSchema);

export default Medic;
 