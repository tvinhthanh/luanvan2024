import Vet from "../models/vet";
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { VetType } from "../shared/types";
import vetController from "../controller/vetController";

const router = express.Router();
const upload = multer(); // Initialize multer middleware

//router.post('/', verifyToken, upload.single('image'), vetController.createMyVet);

// Get all vets
router.get("/", async (req, res) => {
  try {
    const vets = await Vet.find();
    res.status(200).json(vets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vets" });
  }
});

// Get a single vet by ID
router.get("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: "Cannot find vet" });
    }
    res.json(vet);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});


router.put("/:id",verifyToken, async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id, req.params.user);
    if (!vet) {
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
    if (req.body.imageUrls != null) {
      // Ensure imageUrls is an array of strings
      if (Array.isArray(req.body.imageUrls)) {
        vet.imageUrls = req.body.imageUrls;
      } else {
        vet.imageUrls = [req.body.imageUrls];
      }
    }

    vet.lastUpdated = new Date();

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
    res.status(200).json({ message: "Vet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete vet" });
  }
});
// Cập nhật trạng thái vet
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const vet = await Vet.findById(id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    vet.type = type;
    await vet.save();
    res.json(vet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update vet' });
  }
});
export default router;
