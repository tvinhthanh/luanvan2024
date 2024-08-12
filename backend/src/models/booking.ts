import mongoose from "mongoose";
import Vet from "./vet";
import Pet from "./pet";
import UsersApp from "./usersApp";

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    vetId: { type: String, ref: Vet, required: false },
    ownerId: { type: String, ref: UsersApp, required: false },
    petId: { type: String, ref: Pet, required: false },
    phoneOwner: { type: String, required: false },
    date: { type: Date, required: false },
    status: { type: Number, required: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
