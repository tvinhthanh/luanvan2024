import mongoose from "mongoose";

const breedTypeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  array: { type: [String],ref :"breed", required: false },
});

const BreedType = mongoose.model("breedType", breedTypeSchema, "breedType");
export default BreedType;
