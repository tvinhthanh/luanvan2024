import express, { Request, Response } from "express";
import Pet from "../models/pet";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import Owner from "../models/owner";

const router = express.Router();
const saltRounds = 10;



// Get all owners
router.get("/", async (req: Request, res: Response) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch owners" });
  }
});

// Create a new owner
router.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newOwner = new Owner({ name, email, password: hashedPassword });
    await newOwner.save();
    res.status(201).json(newOwner);
  } catch (err) {
    res.status(500).json({ message: "Failed to create owner" });
  }
});

// Update an owner by id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updateData: any = { name, email };
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedOwner);
  } catch (err) {
    res.status(500).json({ message: "Failed to update owner" });
  }
});

// Delete an owner by id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Owner.findByIdAndDelete(id);
    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete owner" });
  }
});


export default router;
