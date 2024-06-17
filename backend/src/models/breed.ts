import mongoose from "mongoose";

const breedSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    name: { type: String, required: true },
    img: { type: String, required: true }, 
    id_type: { type: String, required: true } 
});

const Breed = mongoose.model("Breed", breedSchema, "breed");

export default Breed;
