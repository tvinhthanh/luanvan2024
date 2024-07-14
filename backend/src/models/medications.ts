import mongoose from "mongoose";

const MedicationsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  vetId: { type: String, ref: "Vet", required: true }, // Reference to Vet document
  name: { type: String, required: true }, // Reason for the pet's visit
  dosage: { type: String, required: true }, // Symptoms observed
  instructions: { type: String, required: true }, // Diagnosis made by the veterinarian
  price: { type: String, required: true },
});

const Medic = mongoose.model("Medications", MedicationsSchema, "medications");

export default Medic;
