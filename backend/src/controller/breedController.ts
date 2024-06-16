import { Request, Response } from 'express';
import Breed from '../models/breed';

// Lấy tất cả các giống
export const getAllBreeds = async (req: Request, res: Response) => {
  try {
    const allBreeds = await Breed.find({});
    res.status(200).json(allBreeds);
  } catch (error) {
    console.error('Error fetching breeds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Thêm một giống mới
export const addBreed = async (req: Request, res: Response) => {
  const { _id, name, img } = req.body;
  try {
    const existingBreed = await Breed.findOne({ _id });
    if (existingBreed) {
      return res.status(400).json({ error: 'Breed already exists' });
    }

    const newBreed = new Breed({ _id, name, img });
    await newBreed.save();

    res.status(201).json({ message: 'Breed added successfully', breed: newBreed });
  } catch (error) {
    console.error('Error adding breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Xóa một giống
export const deleteBreed = async (req: Request, res: Response) => {
  const breedId = req.params.id;
  try {
    const existingBreed = await Breed.findById(breedId);
    if (!existingBreed) {
      return res.status(404).json({ error: 'Breed not found' });
    }

    await Breed.deleteOne({ _id: breedId });

    res.status(200).json({ message: 'Breed deleted successfully' });
  } catch (error) {
    console.error('Error deleting breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Cập nhật một giống
export const updateBreed = async (req: Request, res: Response) => {
  const { name, img } = req.body;
  const breedId = req.params.id;
  try {
    const existingBreed = await Breed.findById(breedId);
    if (!existingBreed) {
      return res.status(404).json({ error: 'Breed not found' });
    }

    existingBreed.name = name;
    existingBreed.img = img;
    await existingBreed.save();

    res.status(200).json({ message: 'Breed updated successfully', breed: existingBreed });
  } catch (error) {
    console.error('Error updating breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
