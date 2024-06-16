import express from "express";
import Breed from "../models/breed";
import { addBreed, deleteBreed, getAllBreeds, updateBreed } from "../controller/breedController";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
      const allBreeds = await Breed.find({});
      res.status(200).json(allBreeds);
    } catch (error) {
      console.error("Error fetching breeds:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/add", async (req, res) => {
    const { _id, name, img } = req.body;
    try {
      const existingBreed = await Breed.findOne({ _id });
      if (existingBreed) {
        return res.status(400).json({ error: "Breed already exists" });
      }
  
      const newBreed = new Breed({ _id, name, img });
      await newBreed.save();
  
      res.status(201).json({ message: "Adding breed successful" });
    } catch (error) {
      console.error("Error adding breed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  // Endpoint xóa loại thú cưng
router.delete("/delete/:id", async (req, res) => {
    const breedId = req.params.id;
    try {
      const existingBreed = await Breed.findById(breedId);
      if (!existingBreed) {
        return res.status(404).json({ error: "Breed not found" });
      }
  
      await Breed.deleteOne({ _id: breedId });
  
      res.status(200).json({ message: "Deleting breed successful" });
    } catch (error) {
      console.error("Error deleting breed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Endpoint cập nhật loại thú cưng
  router.put("/update/:id", async (req, res) => {
    const { name, img } = req.body;
    const breedId = req.params.id;
    try {
      const existingBreed = await Breed.findById(breedId);
      if (!existingBreed) {
        return res.status(404).json({ error: "Breed not found" });
      }
  
      existingBreed.name = name;
      existingBreed.img = img;
      await existingBreed.save();
  
      res.status(200).json({ message: "Updating breed successful" });
    } catch (error) {
      console.error("Error updating breed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/", getAllBreeds);
  router.post("/", addBreed);
  router.put("/:id", updateBreed);
  router.delete("/:id", deleteBreed);  
  export default router;