import express, { Request, Response } from "express";
import Pet from "../models/pet";  // Đảm bảo rằng mô hình Pet được định nghĩa đúng
import { createPet, deletePet, getAllPets, updatePet } from "../controller/petController";

const router = express.Router();
//cap nhat pet
router.get("/api/pet/:petId", async (req: Request, res: Response) => {
  const petId = req.params.petId; // Sửa thành petId thay vì Pet_id
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


// // Hàm lấy ID tiếp theo
// const getNextId = async () => {
//   try {
//     // Tìm thú cưng có _id lớn nhất
//     const maxPet = await Pet.findOne().sort({ _id: -1 }).limit(1);
//     if (maxPet) {
//       // Nếu có, tạo _id mới bằng cách tăng giá trị của _id lớn nhất lên 1
//       const currentId = parseInt(maxPet._id) + 1;
//       return currentId.toString();
//     } else {
//       // Nếu không có thú cưng nào trong cơ sở dữ liệu, bắt đầu từ 1
//       return "1";
//     }
//   } catch (error) {
//     console.error("Error getting next pet ID:", error);
//     throw error;
//   }
// };

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
