import express from "express";
import Breed from "../models/breed";
import BreedType from "../models/breedType";

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
  try {
    const { name, img, id_type } = req.body;
    const maxBreed = await Breed.findOne().sort({ _id: -1 });
    const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
    const newBreedType = new Breed({ _id: newId, name, img, id_type });
    const savedBreed = await newBreedType.save();
    await BreedType.findByIdAndUpdate(id_type, { $push: { array: savedBreed._id } });

    res.status(201).json(JSON.stringify(newBreedType));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } 
});

router.put("/:id", async (req, res) => {
  const breedId = req.params.id;
  const { name, img, id_type } = req.body;

  try {
    // Tìm thông tin Breed cũ
    const existingBreed = await Breed.findById(breedId);
    if (!existingBreed) {
      return res.status(404).json({ error: 'Breed not found' });
    }

    // Xoá breedId khỏi array của BreedType cũ (nếu có)
    if (existingBreed.id_type !== id_type) {
      await BreedType.updateOne(
        { _id: existingBreed.id_type },
        { $pull: { array: breedId } }
      );
    }

    // Cập nhật hoặc tạo mới Breed mới
    const updatedBreed = await Breed.findByIdAndUpdate(
      breedId,
      { name, img, id_type },
      { new: true }
    );

    if (!updatedBreed) {
      return res.status(404).json({ error: 'Breed not found' });
    }

    // Thêm breedId vào array của BreedType mới
    await BreedType.updateOne(
      { _id: id_type },
      { $addToSet: { array: breedId } }
    );

    // Trả về kết quả
    res.status(200).json({ message: 'Breed updated successfully', breed: updatedBreed });
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
