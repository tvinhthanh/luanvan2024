import express from "express";
import breedType from "../models/breedType";
import Breed from "../models/breed";
import BreedType from "../models/breedType";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const breedTypes = await breedType.find().lean();
      const breedTypeList = await Promise.all(
        breedTypes.map(async (breedType) => {
          const breeds = await Breed
            .find({ _id: { $in: breedType.array } })
            .select("name img")
            .lean();
          return { ...breedType, breeds };
        })
      );
  
      res.json(breedTypeList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
      const { name } = req.body;
      const maxBreed = await breedType.findOne().sort({ _id: -1 });
      const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
      const newBreedType = new breedType({ _id: newId, name });
      await newBreedType.save(); 
      res.status(201).json(JSON.stringify(newBreedType));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    } 
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Update the BreedType document by ID
    const updatedBreedType = await BreedType.findByIdAndUpdate(
      id,
      { name }, // Update the 'name' field
      { new: true } // Return the updated document
    );

    if (!updatedBreedType) {
      return res.status(404).json({ error: "Breed type not found" });
    }

    res.json(updatedBreedType); // Send the updated document as JSON response
  } catch (error) {
    console.error('Error updating breed type:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await breedType.findByIdAndDelete(id);
    res.status(200).json({ message: "Breed type deleted successfully" }); // Ensure this returns a valid JSON response
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
}
});

export default router;
