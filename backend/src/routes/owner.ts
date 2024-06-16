import express, { Request, Response } from "express";
import Pet from "../models/pet";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import {
  getAllOwners,
  createOwner,
  updateOwner,
  deleteOwner,
} from "../controller/ownerController";

const router = express.Router();

// Endpoint hiển thị thông tin Pet
router.get("/pet/:petId", async (req: Request, res: Response) => {
  const petId = req.params.petId ?? '';
  try {
    const foundPet = await Pet.findById(petId);
    if (foundPet) {
      res.status(200).json(foundPet);
    } else {
      res.status(404).json({ error: "Pet not found" });
    }
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint tạo Pet mới
router.post(
  "/pet",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("age").notEmpty().isNumeric().withMessage("Age is required and must be a number"),
    body("weigh").notEmpty().isNumeric().withMessage("Weight is required and must be a number"),
    body("sex").notEmpty().withMessage("Sex is required"),
    body("img").notEmpty().withMessage("Image URL is required"),
  ],
  async (req: Request, res: Response) => {
    const { name, age, weigh, sex, img, owner_id } = req.body;
    try {
      const newPet = new Pet({
        name,
        age,
        weigh,
        sex,
        img,
        owner_id: req.userId, // Assuming the userId is available from the token
      });
      await newPet.save();
      res.status(201).json(newPet);
    } catch (error) {
      console.error("Error creating new pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Endpoint cập nhật thông tin Pet
router.put("/pet/update/:userId/:petId", async (req: Request, res: Response) => {
  const { userId, petId } = req.params;
  const { name, age, weigh, sex, img } = req.body;

  if (!petId) {
    return res.status(400).json({ error: "Pet ID is required" });
  }

  try {
    // Kiểm tra xem thú cưng có tồn tại trong cơ sở dữ liệu không
    const existingPet = await Pet.findOne({ _id: petId, owner_id: userId });
    if (!existingPet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    // Cập nhật thông tin thú cưng
    existingPet.name = name;
    existingPet.age = age;
    existingPet.weigh = weigh;
    existingPet.sex = sex;
    existingPet.img = img;
    await existingPet.save();

    // Trả về thông báo cập nhật thành công
    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/", getAllOwners);
router.post("/", createOwner);
router.put("/:id", updateOwner);
router.delete("/:id", deleteOwner);
export default router;
