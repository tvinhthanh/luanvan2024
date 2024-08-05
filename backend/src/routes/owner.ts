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
import Owner from "../models/owner";

const router = express.Router();

// Endpoint để đăng nhập tài khoản
router.post("/login", async (req, res) => {
  const { _id, pass } = req.body;
  try {
    const ownerData = await Owner.findOne({ _id, pass });
    if (ownerData) {
      res.status(200).json({
        message: "Login successful",
        avatar: ownerData.img,
        role: ownerData.role,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint để đăng kí tài khoản
router.post("/register", async (req, res) => {
  const { _id, name, email, pass, phone, img } = req.body;
  try {
    // Kiểm tra xem tài khoản đã tồn tại trong cơ sở dữ liệu chưa
    const existingPet = await Owner.findOne({ _id });
    if (existingPet) {
      return res.status(400).json({ error: "Account already exists" });
    }

    // Tạo một tài khoản mới
    const newPet = new Owner({ _id, name, email, pass, phone, img, role: 0 });
    await newPet.save();

    // Trả về thông báo đăng ký thành công
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//get name by id owner
router.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    // Return only the name property
    res.json({ name: owner.name });
  } catch (error) {
    console.error('Error fetching owner by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
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

// Endpoint hiển thị toàn bộ pet của một chủ nhân
router.get("/pet/show/:owner_id", async (req: Request, res: Response) => {
  const owner_id = req.params.owner_id;
  if (!owner_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    // Tìm tất cả các thú cưng của chủ nhân với ID tương ứng
    const ownerPets = await Pet.find({ owner_id });
    if (ownerPets.length === 0) {
      return res.status(404).json({ error: "No pets found for this owner" });
    }
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
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
    existingPet.weight = weigh;
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
