import express, { Request, Response } from "express";
import Pet from "../models/pet";  // Ensure the Pet model is correctly defined
import Owner from "../models/owner"; // Ensure the Owner model is correctly defined
import { createPet, deletePet, getAllPets, updatePet } from "../controller/petController";

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
    existingPet.weigh = weight;
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
router.get("/", getAllPets);
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;
