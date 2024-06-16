import mongoose from "mongoose";

const breedSchema = new mongoose.Schema({
    _id: { type: String, required: true},
    name: { type : String, require: true},
    img: { type : String, require: true},

  });


  const Breed = mongoose.model("breed", breedSchema, "breed");
export default Breed;
