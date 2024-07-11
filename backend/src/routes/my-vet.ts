import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { VetCType } from "../shared/types";
import Vet from "../models/vet";
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


router.post('/',verifyToken, async (req, res) => {
  try {
    const { name, address, phone ,img, description, userId } = req.body;

    const vet = new Vet({_id: uuidv4(),name,address,description,img,phone,user_id: userId,});
    const newVet = await vet.save();
    res.status(201).json(newVet);
  } catch (err) {
    console.error('Error adding vet:', err);
    res.status(400).json({ message: "messageerr" });
  }
});

router.get("/",verifyToken, async (req: Request, res: Response) => {
  const userId = req.query.user_id;
  try {
    const vet = await Vet.find({ user_id: userId});
    res.json(vet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vet" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const vet = await Vet.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(vet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vet" });
  }
});

router.put(
  "/:vetid",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { name, address, phone, imageUrls } = req.body;
      const { vetid } = req.params;
      const userId = req.userId;
      const existingVet = await Vet.findByIdAndUpdate(vetid, { name, address, phone,imageUrls}, { new: true });
      if (!existingVet) {
          return res.status(404).json({ error: 'Vet not found' });
      }
      res.status(200).json({ message: 'Vet updated successfully', vet: existingVet });
    } catch (error) {
      console.error('Error updating vet:', error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;