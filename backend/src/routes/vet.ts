import Vet from "../models/vet";
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { VetType } from "../shared/types";

const router = express.Router();
const upload = multer(); // Initialize multer middleware

//get all vets for admin
router.get("/all", async (req, res) => {
  try {
    const vets = await Vet.find({});
    res.status(200).json(vets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vets" });
  }
});
//Get all vets with type true
router.get("/", async (req, res) => {
  try {
    const vets = await Vet.find({ type: true });
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
const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

// Create a new vet
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const existingVet = await Vet.findOne({ user_id: req.userId });

    if (existingVet) {
      return res.status(409).json({ message: "User vet already exists" });
    }

    const imageUrl = req.file ? await uploadImage(req.file as Express.Multer.File) : "";

    const vet = new Vet({
      ...req.body,
      user_id: req.userId,
      imageUrls: imageUrl ? [imageUrl] : [],
      lastUpdated: new Date(),
    });

    await vet.save();
    res.status(201).send(vet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
