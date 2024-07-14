import mongoose from "mongoose";

const MedicSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  petId: { type: String, ref: 'Pet', required: true }, // Reference to Pet document
  ownerId: { type: String, ref: 'Owner', required: true }, // Reference to Owner document
  vetId: { type: String, ref: 'Vet', required: true }, // Reference to Vet document
  recordId: {type: String, ref:'records', required : true},
  visitDate: { type: Date, required: true }, // Date of the medical record entry
  reasonForVisit: { type: String, required: true }, // Reason for the pet's visit
  symptoms: { type: String, required: true }, // Symptoms observed
  diagnosis: { type: String, required: true }, // Diagnosis made by the veterinarian
  treatmentPlan: { type: String, required: true }, // Treatment plan outlined
  notes: { type: String }, // Additional notes
}, { timestamps: true }); // Automatic timestamps for createdAt and updatedAt

const Medic = mongoose.model('Medic', MedicSchema, 'medicalrecords');


export default Medic;