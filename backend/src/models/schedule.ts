import mongoose from "mongoose";
import UsersApp from "./usersApp";
import Booking from "./booking";


const scheduleSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: UsersApp, required: true }, 
  booking_id: { type: String, ref: Booking, required: false }, 
  description: { type: String, required: false },
  title: { type: String, required: true },
  datetime: { type: Date, required: true },
  type: { type: String, required: true },
}, { timestamps: true });



const Schedule = mongoose.model("schedule", scheduleSchema, "schedule");
export default Schedule;
