  import mongoose, { Schema, Document } from "mongoose";

  export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    phone: string;
    img?: string;
  }

  const usersAppSchema: Schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    img: { type: String } // img không bắt buộc
  });

  const UsersApp = mongoose.model<IUser>("UsersApp", usersAppSchema, "usersApp");

  export default UsersApp;
