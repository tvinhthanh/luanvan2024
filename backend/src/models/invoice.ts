import mongoose, { Schema, Document } from 'mongoose';

const InvoiceSchema: Schema = new Schema({
  medicalRecordId: [{ type: Array, ref: 'medicalrecords', required: true }],
  ownerId: { type: String, required: true },
  petName: { type: String, required: true },
  medications: [{ type: Array, ref: 'medications' }],
  services: [{ type: Array, ref: 'Service' }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create and export the Invoice model
const Invoice = mongoose.model('Invoice', InvoiceSchema, "invoice");

export default Invoice;
