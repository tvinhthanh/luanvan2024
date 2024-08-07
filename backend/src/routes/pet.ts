import express, { Request, Response } from "express";
import Pet from "../models/pet";
import mongoose from "mongoose";
import Medic from "../models/medical";

const router = express.Router();

// Endpoint hiển thị toàn bộ pet theo tài khoản
router.get('/:email', async (req, res) => {
  const email = req.params.email;
  try {
    // Find all pets associated with the given email
    const ownerPets = await Pet.find({ email });
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint thêm một thú cưng theo tài khoản
router.post('/add/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, age, weight, breed_id, sex, breed_type, img, medic_id, record_id } = req.body;

    const newPet = new Pet({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name,
      age,
      weight,
      breed_id,
      email,
      sex,
      breed_type,
      img,
      medic_id,
      record_id
    });

    await newPet.save();

    res.status(201).json({ message: 'Pet added successfully', pet: newPet });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ message: 'Failed to add pet' });
  }
});

// Cập nhật thông tin của pet
router.put("/:petId/weight", async (req, res) => {
  const petId = req.params.petId;
  const { weight } = req.body;
  try {
    // Find pet and update weight
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { weight }, // Ensure weight is kept as a number
      { new: true } // Return the updated document
    );

    if (!updatedPet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error('Error updating pet weight:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint cập nhật thông tin Pet
router.put('/update/:id', async (req, res) => {
  const petId = req.params.id;
  try {
    const { name, age, weight, sex, img } = req.body;

    // Tìm thú cưng dựa trên _id trong cơ sở dữ liệu
    const existingPet = await Pet.findById(petId);

    // Kiểm tra nếu không tìm thấy thú cưng
    if (!existingPet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Cập nhật thông tin thú cưng
    existingPet.name = name;
    existingPet.age = age;
    existingPet.weight = weight;
    existingPet.sex = sex;
    existingPet.img = img;

    // Lưu thông tin cập nhật vào cơ sở dữ liệu
    await existingPet.save();

    // Trả về thông báo cập nhật thành công và thông tin thú cưng đã được cập nhật
    res.status(200).json({ message: 'Updating pet successful', pet: existingPet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Endpoint to get bookings with vet names by petId
router.get('/showContacts/:idPet', async (req, res) => {
  const { idPet } = req.params;

  try {
    const bookings = await Medic.find({ petId: idPet }).populate('vetId', 'name');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Other endpoints
router.get("/", async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pets" });
  }
});
// POST create a new pet
router.post("/", async (req: Request, res: Response) => {
  const { name, type, age, weight, breed_id, owner_id, sex, breed_type, img } = req.body;
  try {
    const newPet = new Pet({ name, type, age, weight, breed_id, owner_id, sex, breed_type, img });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create pet" });
  }
});
// PUT update an existing pet by id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, age, weight, breed_id, owner_id, sex, breed_type, img } = req.body;
  try {
    const updateData: any = { name, type, age, weight, breed_id, owner_id, sex, breed_type, img };
    const updatedPet = await Pet.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedPet);
  } catch (err) {
    res.status(500).json({ message: "Failed to update pet" });
  }
});
// DELETE a pet by id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete pet" });
  }
});
export default router;
