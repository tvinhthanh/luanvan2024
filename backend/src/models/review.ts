import mongoose from "mongoose";
import UsersApp from "./usersApp";
import Vet from "./vet";


const reviewSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    vetId: { type: String, ref: Vet, required: false },
    ownerId: { type: String, ref: UsersApp, required: false },
    comment: { type: String, required: false },
    rating: { type: Number, required: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("review", reviewSchema);

export default Review;
