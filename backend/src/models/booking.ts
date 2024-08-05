import mongoose from "mongoose";
import Vet from "./vet";
import Owner from "./owner";
import Pet from "./pet";

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    vetId: { type: String, ref: Vet, required: true },
    ownerId: { type: String, ref: Owner, required: false },
    petId: { type: String, ref: Pet, required: false },
    phoneOwner: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
