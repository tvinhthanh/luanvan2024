import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  owner_id: { type: String, required: true },
  vet_id: { type: String, required: true },
  pet_id: { type: String, required: true },
  note: { type: String, required: true },
  datetime: { type: Date, required: true },
  status: { type: String, required: true },
});

const Schedule = mongoose.model("schedule", scheduleSchema, "schedule");
export default Schedule;
