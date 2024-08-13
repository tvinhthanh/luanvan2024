import mongoose, { Schema, Document } from "mongoose";
import Medication from "./medications";
import Service from "./service";
import Vet from "./vet";
import Medic from "./medical";

const InvoiceSchema: Schema = new Schema({
  //id tự sinh trong mongo
  _id : {type: String , required: false},
  medicalRecordId: { type: String, ref: Medic, required: true },
  medications: [{ type: String, ref: Medication}],
  services: [{ type: String, ref: Service }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  vetId: { type: String, ref: Vet, required: true },
});

// Create and export the Invoice model
const Invoice = mongoose.model("Invoice", InvoiceSchema, "invoice");

export default Invoice;
