import express from "express";
import multer from "multer"; // Thư viện để xử lý file upload
import path from "path";
import Breed from "../models/breed";
import BreedType from "../models/breedType";

const router = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Điều chỉnh đường dẫn
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('img'), async (req, res) => {
  try {
    const { name, id_type } = req.body;
    const img = req.file?.path; // Đường dẫn đến file

    if (!img) {
      throw new Error('File upload failed');
    }

    const maxBreed = await Breed.findOne().sort({ _id: -1 });
    const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
    const newBreed = new Breed({ _id: newId, name, img, id_type });
    const savedBreed = await newBreed.save();
    await BreedType.findByIdAndUpdate(id_type, { $push: { array: savedBreed._id } });

    res.status(201).json(savedBreed);
  } catch (error) {
    console.error('Error adding breed:', error);
    res.status(500).json({ error: "Internal server error" });
  }
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

// // Sử dụng multer để xử lý file upload trong POST route
// router.post("/", upload.single('img'), async (req, res) => {
//   try {
//     const { name, id_type } = req.body;
//     const img = req.file?.path; // Lấy đường dẫn đến file đã tải lên

//     const maxBreed = await Breed.findOne().sort({ _id: -1 });
//     const newId = maxBreed?._id ? maxBreed._id + 1 : 1;
//     const newBreed = new Breed({ _id: newId, name, img, id_type });
//     const savedBreed = await newBreed.save();
//     await BreedType.findByIdAndUpdate(id_type, { $push: { array: savedBreed._id } });

//     res.status(201).json(savedBreed);
//   } catch (error) {
//     console.error('Error adding breed:', error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Sử dụng multer để xử lý file upload trong PUT route
router.put("/:id", upload.single('img'), async (req, res) => {
  const breedId = req.params.id;
  const { name, id_type } = req.body;
  const img = req.file?.path; // Đường dẫn đến file hình ảnh

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

    // Cập nhật Breed mới
    const updatedBreed = await Breed.findByIdAndUpdate(
      breedId,
      { name, img: img || existingBreed.img, id_type },
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

    // Xoá breedId khỏi array của BreedType liên quan
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
