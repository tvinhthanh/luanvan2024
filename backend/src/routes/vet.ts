import Vet from "../models/vet";
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { VetType } from "../shared/types";
import vetController from "../controller/vetController";

const router = express.Router();
const upload = multer(); // Initialize multer middleware

//router.post('/', verifyToken, upload.single('image'), vetController.createMyVet);

// Get all vets
router.get("/", async (req, res) => {
  try {
    const vets = await Vet.find();
    res.status(200).json(vets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vets" });
  }
});

// Get a single vet by ID
router.get("/:id", async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: "Cannot find vet" });
    }
    res.json(vet);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});


// router.post('/',verifyToken, async (req, res) => {
//   try {
//     const { name, address, phone ,img, description, userId } = req.body;

//     const vet = new Vet({name,address,description,img,phone,user_id: userId,});
//     const newVet = await vet.save();
//     res.status(201).json(newVet);
//   } catch (err) {
//     console.error('Error adding vet:', err);
//     res.status(400).json({ message: "messageerr" });
//   }
// });

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
// });
// router.post('/upload',)
// // Route to create a new Vet
// router.post(
//   '/',
//   verifyToken, // Assuming this middleware verifies the JWT token
//   [
//     body('name').notEmpty().withMessage('Name is required'),
//     body('address').notEmpty().withMessage('Address is required'),
//     body('phone').notEmpty().withMessage('Phone is required'),
//     body('service').isArray().withMessage('Service must be an array'),
//     body('service.*').notEmpty().withMessage('Each service item must not be empty'),
//   ],
//   upload.array('imageFiles', 6), // Handle up to 6 image files
//   async (req: Request, res: Response) => {
//     try {
//       if (!req.files || req.files.length === 0) {
//         throw new Error('No image files were uploaded.');
//       }

//       const imageFiles = req.files as Express.Multer.File[];
//       const { name, address, phone, service, user_id, createdAt, lastUpdated } = req.body;
//       const createdAtDate = new Date(createdAt || Date.now());
//       const lastUpdatedDate = new Date(lastUpdated || Date.now());
//       const imageUrls = await uploadImages(imageFiles); // Call uploadImages from api-client.ts
//       // Create new Vet object
//       const newVet = new Vet({
//         name,
//         address,
//         phone,
//         service,
//         user_id,
//         createdAt: createdAtDate,
//         imageUrls,
//         lastUpdated: lastUpdatedDate,
//       });
//       // Save new Vet to database
//       await newVet.save();
//       // Send response with the newly created Vet object
//       res.status(201).json(newVet);
//     } catch (error) {
//       console.error('Error creating Vet:', error);
//       res.status(500).json({ message:'Something went wrong' });
//     }
//   }
// );
// async function uploadImages(imageFiles: Express.Multer.File[]) {
//   const uploadPromises = imageFiles.map(async (image) => {
//     const b64 = Buffer.from(image.buffer).toString("base64");
//     let dataURI = "data:" + image.mimetype + ";base64," + b64;
//     const res = await cloudinary.v2.uploader.upload(dataURI);
//     return res.url;
//   });

//   const imageUrls = await Promise.all(uploadPromises);
//   return imageUrls;
// }

// Update a vet by ID
router.put("/:id",verifyToken, async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id, req.params.user);
    if (!vet) {
      return res.status(404).json({ message: "Cannot find vet" });
    }

    if (req.body.name != null) {
      vet.name = req.body.name;
    }
    if (req.body.address != null) {
      vet.address = req.body.address;
    }
    if (req.body.phone != null) {
      vet.phone = req.body.phone;
    }
    if (req.body.service != null) {
      vet.service = req.body.service;
    }
    if (req.body.user_id != null) {
      vet.user_id = req.body.user_id;
    }
    if (req.body.imageUrls != null) {
      // Ensure imageUrls is an array of strings
      if (Array.isArray(req.body.imageUrls)) {
        vet.imageUrls = req.body.imageUrls;
      } else {
        vet.imageUrls = [req.body.imageUrls];
      }
    }

    vet.lastUpdated = new Date();

    const updatedVet = await vet.save();
    res.json(updatedVet);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a vet by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Vet.findByIdAndDelete(id);
    res.status(200).json({ message: "Vet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete vet" });
  }
});

export default router;
