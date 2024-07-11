import express, { Request, Response } from "express";
import Pet from "../models/pet";  // Đảm bảo rằng mô hình Pet được định nghĩa đúng
import { createPet, deletePet, getAllPets, updatePet } from "../controller/petController";
import Owner from "../models/owner";

const router = express.Router();

// Endpoint hiển thị toàn bộ pet của một chủ nhân
router.get("/show/:owner_id", async (req, res) => {
  const owner_id = req.params.owner_id;
  try {
    // Tìm tất cả các thú cưng của chủ nhân với ID tương ứng
    const ownerPets = await Pet.find({ owner_id });
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/:owner_id", async (req, res) => {
  const owner_id = req.params.owner_id;
  try {
    // Tìm tất cả các thú cưng của chủ nhân với ID tương ứng
    const ownerPets = await Pet.find({ owner_id });
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//Endpoint hiển thị thông tin pet
router.get("/detail/:pet_id", async (req, res) => {
  const petId = req.params.pet_id; 
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
//cap nhat pet
router.get("/api/pet/:petId", async (req: Request, res: Response) => {
  const petId = req.params.petId; 
  try {
    const foundPet = await Pet.findById(petId).populate('breed_id', 'name');
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


const getNextId = async () => {
  try {
    // Tìm thú cưng có _id lớn nhất
    const maxPet = await Pet.findOne().sort({ _id: -1 }).limit(1);
    if (maxPet) {
      // Nếu có, tạo _id mới bằng cách tăng giá trị của _id lớn nhất lên 1
      const currentId = parseInt(maxPet._id) + 1;
      return currentId.toString();
    } else {
      // Nếu không có thú cưng nào trong cơ sở dữ liệu, bắt đầu từ 1
      return "1";
    }
  } catch (error) {
    console.error("Error getting next pet ID:", error);
    throw error;
  }
};
//Them moi
router.post("/add/:owner_id", async (req, res) => {
  const { name, age, weigh, breed_id, sex, breed_type, img } = req.body;
  const owner_id = req.params.owner_id;
  try {
    // Lấy _id tiếp theo
    const nextId = await getNextId();

    // Kiểm tra xem chủ nhân của thú cưng đã tồn tại trong cơ sở dữ liệu chưa
    const existingOwner = await Owner.findById(owner_id);
    if (!existingOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Tạo một thú cưng mới với _id đã được tạo
    const newPet = new Pet({
      _id: nextId,
      name,
      age,
      weigh,
      breed_id,
      owner_id,
      sex,
      breed_type,
      img,
    });
    await newPet.save();

    // Trả về thông báo thêm thành công
    res.status(201).json({ message: "Adding pet successful" });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint cập nhật thông tin Pet
router.put("/update/:userId/:petId", async (req: Request, res: Response) => {
  const { userId, petId } = req.params;
  const { name, age, weigh, sex, img } = req.body;

  try {
    // Kiểm tra xem thú cưng có tồn tại trong cơ sở dữ liệu không
    const existingPet = await Pet.findOne({ _id: petId,  Pets_id: userId });
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


router.delete("/api/pet/delete/:id", async (req, res) => {
    const petId = req.params.id;
    try {
      // Kiểm tra xem thú cưng có tồn tại trong cơ sở dữ liệu không
      const existingPet = await Pet.findById(petId);
      if (!existingPet) {
        return res.status(404).json({ error: "Pet not found" });
      }
  
      // Xóa thú cưng khỏi cơ sở dữ liệu
      await Pet.deleteOne({ _id: petId });
  
      // Trả về thông báo xóa thành công
      res.status(200).json({ message: "Deleting pet successful" });
    } catch (error) {
      console.error("Error deleting pet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.get("/", getAllPets);
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);
export default router;
