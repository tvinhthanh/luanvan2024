import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import verifyToken from '../middleware/auth';
import Vet from '../models/vet';
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB
  },
});

// Upload hình ảnh và lưu thông tin bác sĩ thú y
router.post('/', verifyToken, upload.array('imageFiles', 1), async (req: Request, res: Response) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const { name, address, phone, description, userId } = req.body;

    if (!name || !address || !phone || !description || !userId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Upload hình ảnh lên Cloudinary và lấy URL
    const imageUrls = await uploadImages(imageFiles);

    // Tạo đối tượng Vet mới với các URL hình ảnh
    const vet = new Vet({
      _id: uuidv4(),
      name,
      address,
      description,
      phone,
      user_id: userId,
      imageUrls // Lưu URL của hình ảnh vào cơ sở dữ liệu
    });

    // Lưu đối tượng Vet mới vào cơ sở dữ liệu
    const newVet = await vet.save();
    res.status(201).json(newVet);
  } catch (err) {
    console.error('Error adding vet:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Lấy danh sách phòng khám theo user_id
router.get('/', verifyToken, async (req: Request, res: Response) => {
  const userId = req.query.user_id as string;
  try {
    const vets = await Vet.find({ user_id: userId });
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vets' });
  }
});

// Lấy thông tin phòng khám theo ID
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const vet = await Vet.findOne({ _id: id, user_id: req.userId });
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    res.json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vet' });
  }
});

// Cập nhật thông tin bác sĩ thú y theo ID
router.put("/:vetid", upload.array('imageFiles'), async (req: Request, res: Response) => {
  try {
    const { name, address, phone, description } = req.body;
    const { vetid } = req.params;

    // Xử lý hình ảnh
    const imageFiles = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      imageUrls = await uploadImages(imageFiles);
    }

    // Cập nhật thông tin bác sĩ thú y
    const updatedVet = await Vet.findByIdAndUpdate(
      vetid,
      { name, address, phone, description, imageUrls },
      { new: true }
    );

    if (!updatedVet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    res.status(200).json({ message: 'Vet updated successfully', vet: updatedVet });
  } catch (error) {
    console.error('Error updating vet:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// Hàm upload hình ảnh lên Cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${b64}`;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.secure_url; // Trả về URL hình ảnh
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
