import mongoose from "mongoose";


const petSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  weigh: { type: String, required: true },
  breed_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedType', required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  sex: { type: String, required: true },
  breed_type: { type: String, required: true },
  img: { type: String, required: true }
});

const Pet = mongoose.model("pet", petSchema, "pet");
export default Pet;

