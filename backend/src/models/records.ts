import mongoose, { Schema } from "mongoose";

const RecordsSchema: Schema = new Schema({
  _id: {type: String, required: true},
  petId: { type: String, ref: 'Pet', required: true }, // Reference to Pet document
  ownerId: { type: String, ref: 'Owner', required: true }, // Reference to Owner document
  vetId: { type: String, ref: 'Vet', required: true }, // Reference to Vet document
  medicId: {type: [String], ref: 'Medic', required: false},
}, { timestamps: true }); // Automatic timestamps for createdAt and updatedAt

const Record = mongoose.model('Record', RecordsSchema, 'records');

export default Record;
