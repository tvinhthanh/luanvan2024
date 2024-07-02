// src/controllers/vetController.ts

import { Request, Response } from "express";
import Vet from "../models/vet";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

const createMyVet = async (req: Request, res: Response) => {
  try {
    const existingVet = await Vet.findOne({ user_id: req.userId });

    if (existingVet) {
      return res.status(409).json({ message: "User vet already exists" });
    }

    const imageUrl = req.file ? await uploadImage(req.file as Express.Multer.File) : [];

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
};

export default {
  createMyVet,
};
