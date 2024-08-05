import mongoose from "mongoose";
import Vet from "./vet";
<<<<<<< HEAD
=======
import Owner from "./owner";
import Pet from "./pet";
>>>>>>> 2d725c15 (5.8 remove controller)

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    vetId: { type: String, ref: Vet, required: true },
<<<<<<< HEAD
    ownerId: { type: String, ref: "Owner", required: false },
    petId: { type: String, ref: "Pet", required: false },
=======
    ownerId: { type: String, ref: Owner, required: false },
    petId: { type: String, ref: Pet, required: false },
>>>>>>> 2d725c15 (5.8 remove controller)
    phoneOwner: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Number, required: true },
  },
  { timestamps: true }
);

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
