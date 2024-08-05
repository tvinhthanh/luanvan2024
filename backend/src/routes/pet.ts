import express, { Request, Response } from "express";
import Pet from "../models/pet";  // Ensure the Pet model is correctly defined
import Owner from "../models/owner"; // Ensure the Owner model is correctly defined

const router = express.Router();

// Function to get the next sequential pet ID
const getNextId = async () => {
  try {
    const maxPet = await Pet.findOne().sort({ _id: -1 }).limit(1);
    if (maxPet) {
      const currentId = parseInt(maxPet._id) + 1;
      return currentId.toString();
    } else {
      return "1";
    }
  } catch (error) {
    console.error("Error getting next pet ID:", error);
    throw error;
  }
};

// Endpoint to display all pets of an owner
router.get("/show/:owner_id", async (req, res) => {
  const owner_id = req.params.owner_id;
  try {
    const ownerPets = await Pet.find({ owner_id });
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const ownerPets = await Pet.find({ email });
    res.status(200).json(ownerPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Internal server error" });
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


// Endpoint to display details of a pet
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

// Endpoint to add a new pet
router.post("/add/:owner_id", async (req, res) => {
  const { name, age, weight, breed_id, sex, breed_type, img } = req.body;
  const owner_id = req.params.owner_id;
  try {
    const nextId = await getNextId();

    const existingOwner = await Owner.findById(owner_id);
    if (!existingOwner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    const newPet = new Pet({
      _id: nextId,
      name,
      age,
      weight,
      breed_id,
      owner_id,
      sex,
      breed_type,
      img,
    });
    await newPet.save();

    res.status(201).json({ message: "Adding pet successful" });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to update pet information
router.put("/update/:userId/:petId", async (req: Request, res: Response) => {
  const { userId, petId } = req.params;
  const { name, age, weight, sex, img } = req.body;

  try {
    const existingPet = await Pet.findOne({ _id: petId, owner_id: userId });
    if (!existingPet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    existingPet.name = name;
    existingPet.age = age;
    existingPet.weight = weight;
    existingPet.sex = sex;
    existingPet.img = img;
    await existingPet.save();

    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete a pet
router.delete("/delete/:id", async (req, res) => {
  const petId = req.params.id;
  try {
    const existingPet = await Pet.findById(petId);
    if (!existingPet) {
      return res.status(404).json({ error: "Pet not found" });
    }

    await Pet.deleteOne({ _id: petId });

    res.status(200).json({ message: "Deleting pet successful" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ error: "Internal server error" });
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
