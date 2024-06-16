import express from "express";
import Vet from "../models/vet";

const router = express.Router();

// Get all vets
router.get("/", async (req, res) => {
  try {
    const users = await Vet.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get a single vet by ID
router.get("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (vet == null) {
      return res.status(404).json({ message: "Cannot find vet" });
    }
    res.json(vet);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a new vet
router.post("/", async (req, res) => {
  const vet = new Vet({
    _id: req.body._id,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    service: req.body.service,
    user_id: req.body.user_id,
  });

  try {
    const newVet = await vet.save();
    res.status(201).json(newVet);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a vet by ID
router.put("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (vet == null) {
      return res.status(404).json({ message: "Cannot find vet" });
    }

    if (req.body.name != null) {
      vet.name = req.body.name;
    }
    if (req.body.address != null) {
      vet.address = req.body.address;
    }
    if (req.body.phone != null) {
      vet.phone = req.body.phone;
    }
    if (req.body.service != null) {
      vet.service = req.body.service;
    }
    if (req.body.user_id != null) {
      vet.user_id = req.body.user_id;
    }

    const updatedVet = await vet.save();
    res.json(updatedVet);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a vet by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Vet.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
