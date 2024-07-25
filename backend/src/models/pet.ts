import mongoose from "mongoose";


const petSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  weigh: { type: String, required: true },
  breed_id: { type: String, ref: 'BreedType', required: true },
  email: { type: String, ref: 'Owner', required: true },
  sex: { type: String, required: true },
  breed_type: { type: String, required: true },
  img: { type: String, required: true },
  medic_id: {type: [String], ref: 'Medic', required: false},
  record_id : {type: [String], ref: 'Record', required: false}
});

const Pet = mongoose.model("pet", petSchema, "pet");
export default Pet;

