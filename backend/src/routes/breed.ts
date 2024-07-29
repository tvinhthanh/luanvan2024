import express from "express";
import multer from "multer";
import path from "path";
import cloudinary from 'cloudinary'; // Đường dẫn đến file cấu hình Cloudinary
import Breed from "../models/breed";
import BreedType from "../models/breedType";

const router = express.Router();

// Cấu hình multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

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
// Route POST để thêm giống
router.post("/", upload.single('img'), async (req, res) => {
  try {
    const { name, id_type } = req.body;
    const img = req.file;

    if (!img) {
      throw new Error('File upload failed');
    }

    // Upload hình ảnh lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          reject(new Error('Cloudinary upload failed'));
        } else {
          resolve(result);
        }
      }).end(img.buffer);
    });

    // Lấy URL hình ảnh từ kết quả upload
    const imgUrl = (result as cloudinary.UploadApiResponse).secure_url;

    // Tạo và lưu giống mới vào cơ sở dữ liệu
    const maxBreed = await Breed.findOne().sort({ _id: -1 });
    const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
    const newBreed = new Breed({ _id: newId, name, img: imgUrl, id_type });
    const savedBreed = await newBreed.save();
    await BreedType.findByIdAndUpdate(id_type, { $push: { array: savedBreed._id } });

    res.status(201).json(savedBreed);
  } catch (error) {
    console.error('Error adding breed:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route PUT để cập nhật giống
router.put("/:id", upload.single('img'), async (req, res) => {
  const breedId = req.params.id;
  const { name, id_type } = req.body;
  const img = req.file;

  try {
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

    let imgUrl = existingBreed.img;

    if (img) {
      // Upload hình ảnh mới lên Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(new Error('Cloudinary upload failed'));
          } else {
            resolve(result);
          }
        }).end(img.buffer);
      });

      imgUrl = (result as cloudinary.UploadApiResponse).secure_url;
    }

    // Cập nhật Breed mới vào cơ sở dữ liệu
    const updatedBreed = await Breed.findByIdAndUpdate(
      breedId,
      { name, img: imgUrl, id_type },
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

    res.status(200).json({ message: 'Breed updated successfully', breed: updatedBreed });
  } catch (error) {
    console.error('Error updating breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route DELETE để xóa giống
router.delete("/:id", async (req, res) => {
  try {
    const breedId = req.params.id;
    const existingBreed = await Breed.findByIdAndDelete(breedId);
    if (!existingBreed) {
      return res.status(404).json({ error: 'Breed not found' });
    }

    await BreedType.updateOne(
      { array: breedId },
      { $pull: { array: breedId } }
    );

    res.status(200).json({ message: 'Breed deleted successfully' });
  } catch (error) {
    console.error('Error deleting breed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
