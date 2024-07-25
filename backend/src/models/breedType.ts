import mongoose from "mongoose";

const breedTypeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  array: { type: [String],ref :"Breed", required: false },
});

const BreedType = mongoose.model("BreedType", breedTypeSchema, "breedType");
export default BreedType;
