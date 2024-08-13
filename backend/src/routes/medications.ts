import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import Medic from '../models/medications'; // Import Medic model
import Vet from '../models/vet';
import medicalRecords from '../models/medical';
import Medication from '../models/medications';


const router = express.Router();

// Function to generate the next medication ID
const generateNextMedicationId = async (): Promise<string> => {
  try {
    const lastMedication = await Medication.findOne({}).sort({ _id: -1 }).limit(1);
    let nextId = 1;

    if (lastMedication) {
      // Extract numeric part and increment
      const lastId = lastMedication._id as string;
      const match = lastId.match(/^med(\d+)$/);
      if (match) {
        nextId = parseInt(match[1], 10) + 1;
      }
    }

    return `med${nextId}`;
  } catch (error) {
    console.error('Error generating medication ID:', error);
    throw new Error('Error generating medication ID');
  }
};

// Create a new medication for a vet
router.post('/:vetId', verifyToken, async (req: Request, res: Response) => {
  const vetId = req.params.vetId;

  try {
    const { name, dosage, instructions, price, quantity } = req.body;
    const newMedicationId = await generateNextMedicationId();

    // Check if medication with the same name already exists for the vet
    const existingMedication = await Medication.findOne({ name, vetId });
    if (existingMedication) {
      return res.status(400).json({ error: 'Medication with this name already exists for this vet.' });
    }

    // Create a new medication instance
    const newMedication = new Medication({ _id: newMedicationId, name, dosage, instructions, price, quantity, vetId });

    // Save the new medication to the database
    const savedMedication = await newMedication.save();

    // Add the medication to Vet's medications array
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }
    
    // Check if the medication is already in the vet's medications array
    if (!vet.medications.includes(savedMedication._id)) {
      vet.medications.push(savedMedication._id);
      await vet.save();
    }

    // Respond with the saved medication object
    res.status(201).json(savedMedication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:vetId/chart', async (req: Request, res: Response) => {
  const { vetId } = req.params;
  try {
    const medications = await Medication.find({ vetId }, 'name time');
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all medications for a specific vet
router.get('/:vetId', verifyToken, async (req, res) => {
  const { vetId } = req.params;
  try {
    const medications = await Medication.find({ vetId });
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all medications (for admin or general purpose)
router.get('/', verifyToken, async (req, res) => {
  try {
    const medications = await Medication.find();
    res.status(200).json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a medication by id
router.get('/med/:id', verifyToken, async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
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
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, dosage, instructions, price, vetId, quantity } = req.body;

  try {
    // Validate input data
    if (!name || !dosage || !price || !vetId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Update the medication details
    const updatedMedication = await Medication.findByIdAndUpdate(
      id,
      { name, dosage, instructions, price, vetId, quantity },
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Update Vet's medications array if needed
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    // Remove the old medication reference if needed
    vet.medications = vet.medications.filter(med => med.toString() !== id);

    // Add the updated medication reference
    vet.medications.push(updatedMedication._id);

    // Optional: flatten the array if there's a possibility of nested arrays
    vet.medications = vet.medications.flat();

    // Save the updated vet
    await vet.save();

    // Respond with the updated medication
    res.status(200).json(updatedMedication);

  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Delete a medication by id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedMedication = await Medication.findByIdAndDelete(req.params.id);
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
