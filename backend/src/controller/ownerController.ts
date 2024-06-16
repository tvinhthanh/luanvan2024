import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Owner from "../models/owner";

const saltRounds = 10;

export const getAllOwners = async (req: Request, res: Response) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch owners" });
  }
};

export const createOwner = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newOwner = new Owner({ name, email, password: hashedPassword });
    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (err) {
    res.status(500).json({ message: "Failed to create owner" });
  }
};

export const updateOwner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updateData: any = { name, email };
    
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedOwner);
  } catch (err) {
    res.status(500).json({ message: "Failed to update owner" });
  }
};

export const deleteOwner = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Owner.findByIdAndDelete(id);
    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete owner" });
  }
};
