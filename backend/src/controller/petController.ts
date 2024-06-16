import { Request, Response } from "express";
import Pet from "../models/pet"; // Assuming you have a Pet model defined

const saltRounds = 10;

export const getAllPets = async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pets" });
  }
};

export const createPet = async (req: Request, res: Response) => {
  const { name, type, age, weigh, breed_id, owner_id, sex, breed_type, img } = req.body;
  try {
    // Example hashing the password, adjust as needed
    const newPet = new Pet({ name, type, age, weigh, breed_id, owner_id, sex, breed_type, img });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create pet" });
  }
};

export const updatePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, age, weigh, breed_id, owner_id, sex, breed_type, img } = req.body;
  try {
    const updateData: any = { name, type, age, weigh, breed_id, owner_id, sex, breed_type, img };
    const updatedPet = await Pet.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedPet);
  } catch (err) {
    res.status(500).json({ message: "Failed to update pet" });
  }
};

export const deletePet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete pet" });
  }
};
