import express from "express";
import Breed from "../models/breed";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
      const breeds = await Breed.find();
      res.status(200).json(breeds);
  } catch (error) {
      console.error('Error fetching breeds:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);
    if (!breed) {
      return res.status(404).json({ error: 'Breed not found' });
    }
    res.status(200).json(breed);
  } catch (error) {
    console.error('Error fetching breed by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post("/", async (req, res) => {
  // try {
  //   const { name, img, id_type } = req.body;
  //   if (!name || !img || !id_type) {
  //     return res.status(400).json({ error: 'Name, img, and id_type are required fields' });
  //   }
  //   const newBreed = new Breed({
  //     name,
  //     img,
  //     id_type,
  //   });
  //   const savedBreed = await newBreed.save();
  //   res.status(201).json(savedBreed);
  // } catch (error) {
  //   console.error('Error adding breed:', error);
  //   res.status(500).json({ error: 'Error adding breed' });
  // }
  try {
    const { name, img, id_type } = req.body;
    const maxBreed = await Breed.findOne().sort({ _id: -1 });
    const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
    const newBreedType = new Breed({ _id: newId, name, img, id_type });
    await newBreedType.save(); 
    res.status(201).json(JSON.stringify(newBreedType));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } 
});
router.put("/:id", async (req, res) => {
  try {
      const { name, img } = req.body;
      const breedId = req.params.id;
      const existingBreed = await Breed.findByIdAndUpdate(breedId, { name, img }, { new: true });
      if (!existingBreed) {
          return res.status(404).json({ error: 'Breed not found' });
      }
      res.status(200).json({ message: 'Breed updated successfully', breed: existingBreed });
  } catch (error) {
      console.error('Error updating breed:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete("/:id", async (req, res) => {
  try {
      const breedId = req.params.id;
      const existingBreed = await Breed.findByIdAndDelete(breedId);
      if (!existingBreed) {
          return res.status(404).json({ error: 'Breed not found' });
      }
      res.status(200).json({ message: 'Breed deleted successfully' });
  } catch (error) {
      console.error('Error deleting breed:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
