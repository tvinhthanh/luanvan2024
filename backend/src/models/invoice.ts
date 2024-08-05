import mongoose, { Schema, Document } from "mongoose";

const InvoiceSchema: Schema = new Schema({
  //id tự sinh trong mongo
  medicalRecordId: { type: String, ref: "Medic", required: true },
  medications: { type: Array, ref: "Medication" },
  services: { type: Array, ref: "Service" },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  vetId: { type: String, ref: "Vet", required: true },
});

// Create and export the Invoice model
const Invoice = mongoose.model("Invoice", InvoiceSchema, "invoice");

export default Invoice;
