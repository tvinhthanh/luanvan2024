import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import Medic from '../models/medications'; // Import Medic model
import Vet from '../models/vet';
import medicalRecords from '../models/medical';


const router = express.Router();

// Create a new medication for a vet
router.post('/:vetId', verifyToken, async (req, res) => {
    const vetId = req.params.vetId; // Extract vetId from the URL parameter
    
    try {
      const { name, dosage, instructions, price } = req.body;
      const lastMedication = await Medic.findOne({}).sort({ _id: -1 }).limit(1);

    let newMedicationId;
    if (lastMedication) {
      // Lấy _id cuối cùng và tăng lên 1
      newMedicationId = lastMedication._id + 1;
    } else {
      // Nếu không có medication nào trong database
      newMedicationId = 1;
    }
      // Check if medication with the same name already exists for the vet
      const existingMedication = await Medic.findOne({ name, vetId });
      if (existingMedication) {
        return res.status(400).json({ error: 'Medication with this name already exists for this vet.' });
      }
  
      // Create a new medication instance
      const newMedication = new Medic({ _id: newMedicationId, name, dosage, instructions, price, vetId });
  
      // Save the new medication to the database
      const savedMedication = await newMedication.save();
  
      // Add the medication to Vet's medications array
      const vet = await Vet.findById(vetId);
      if (!vet) {
        return res.status(404).json({ error: 'Vet not found' });
      }
      vet.medications.push(savedMedication);
      await vet.save();
  
      // Respond with the saved medication object
      res.status(201).json(savedMedication);
    } catch (error) {
      console.error('Error creating medication:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get all medications for a specific vet
router.get('/:vetId', verifyToken, async (req, res) => {
  const { vetId } = req.params;

  try {
    const medications = await Medic.find({ vetId });
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all medications (for admin or general purpose)
router.get('/', verifyToken, async (req, res) => {
  try {
    const medications = await Medic.find();
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a medication by id
router.get('/med/:id', verifyToken, async (req, res) => {
  try {
    const medication = await Medic.findById(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json(medication);
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a medication by id
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, dosage, instructions, price, vetId } = req.body;

  try {
    const updatedMedication = await Medic.findByIdAndUpdate(
      id,
      { name, dosage, instructions, price,vetId },
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
      // Add the medication to Vet's medications array
      const vet = await Vet.findById(vetId);
      if (!vet) {
        return res.status(404).json({ error: 'Vet not found' });
      }
      vet.medications.push(updatedMedication);
      await vet.save();
    res.status(200).json(updatedMedication);
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a medication by id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedMedication = await Medic.findByIdAndDelete(req.params.id);
    if (!deletedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
