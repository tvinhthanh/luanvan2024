import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  pass: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: Number, required: true },
  img: { type: String, required: true }
  });

const Owner = mongoose.model("owner", ownerSchema, "usersApp");
export default Owner;
