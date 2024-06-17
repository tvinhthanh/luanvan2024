import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  hotelId: { type: String, ref: "Hotel", required: true },
  userId: { type: String, ref: "User", required: true },
  customerName: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { type: String, required: true },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
