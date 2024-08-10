import mongoose from "mongoose";
import Vet from "./vet";

const MedicSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    petId: { type: String, ref: "Pet", required: true }, // Reference to Pet document
    ownerId: { type: String, ref: "Owner", required: true }, // Reference to Owner document
    vetId: { type: String, ref: Vet, required: true }, // Reference to Vet document
    visitDate: { type: Date, required: true }, // Date of the medical record entry
    reasonForVisit: { type: String, required: true }, // li do
    symptoms: { type: String, required: true }, // trieu chung
    diagnosis: { type: String, required: true }, // chuan doan
    treatmentPlan: { type: String, required: true }, // Treatment plan outlined
    notes: { type: String }, // Additional notes
    medications: [{ type: String, ref: "Medication" }], // Reference to Medication documents
    hasInvoice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Medic = mongoose.model("Medic", MedicSchema, "medicalrecords");

export default Medic;
