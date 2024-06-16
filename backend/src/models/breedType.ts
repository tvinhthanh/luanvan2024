import mongoose from "mongoose";

const breedTypeSchema = new mongoose.Schema({
  _id: { type: String, required: false },
  name: { type: String, required: true },
  array: { type: Array, required: false },
});

const BreedType = mongoose.model("breedType", breedTypeSchema, "breedType");
export default BreedType;
