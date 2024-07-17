import express, { Request, Response } from 'express';
import medicalRecord from '../models/medical';
import vet from '../models/vet';
import verifyToken from '../middleware/auth';
import Medic from '../models/medical';
import Vet from '../models/vet';
import Record from '../models/records';
import Pet from '../models/pet';
const { v4: uuidv4 } = require('uuid');


const router = express.Router();

router.get("/:vetId", verifyToken, async (req: Request, res: Response) => {
  const { vetId } = req.params;

  try {
    const medics = await Medic.find({ vetId }); 
    res.status(200).json(medics);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/by-pet/:petId', async (req:Request, res:Response) => {
  const { petId } = req.params;

  try {
    const records = await medicalRecord.find({ petId });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: Error });
  }
});
// Get a specific medical record by ID (for vet)
router.get('/detail/:medicId', verifyToken, async (req: Request, res: Response) => {
  const { medicId } = req.params;
  try {
    const medic = await Medic.findById({_id: medicId});
    
    if (!medic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json(medic);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a medical record by ID (for vet)
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const updatedMedic = await medicalRecord.findOneAndUpdate(
      { _id: req.params.id, vetId: req.userId }, // Assuming vetId is obtained from the authenticated user
      {
        petId: req.body.petId,
        ownerId: req.body.ownerId,
        visitDate: req.body.visitDate,
        reasonForVisit: req.body.reasonForVisit,
        symptoms: req.body.symptoms,
        diagnosis: req.body.diagnosis,
        treatmentPlan: req.body.treatmentPlan,
        medications: req.body.medications,
        notes: req.body.notes,
      },
      { new: true }
    );

    if (!updatedMedic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.status(200).json(updatedMedic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a medical record by ID (for vet)
router.delete('/detail/:medicId', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deletedMedic = await medicalRecord.findOneAndDelete({ id });
    if (!deletedMedic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});
//create
router.post('/',verifyToken, async (req: Request, res: Response) => {
  try {
    const { recordId, vetId, petId, ownerId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    // Validate required fields
    if (!recordId || !vetId || !petId || !ownerId || !reasonForVisit) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate medications array
    if (!Array.isArray(medications) || medications.some(med => typeof med !== 'object' || !med._id)) {
      return res.status(400).json({ error: 'Invalid medications array.' });
    }

    // Check if the pet has an existing medical record
    const existingRecord = await Record.findOne({ petId });

    if (!existingRecord) {
      return res.status(400).json({ error: "Pet doesn't have a medical record. Please create one first." });
    }

    // Create a new instance of MedicalRecord
    const newMedicalRecord = new medicalRecord({
      _id: uuidv4(), // Generate a new UUID for the medical record
      petId,
      ownerId,
      vetId,
      recordId,
      visitDate: new Date(),
      reasonForVisit,
      symptoms,
      diagnosis,
      treatmentPlan,
      medications,
      notes,
    });

    // Save the new MedicalRecord
    const savedMedicalRecord = await newMedicalRecord.save();

    // Update medicalRecords array for the pet
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $push: { record_id: savedMedicalRecord._id } },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    // Update medicalRecords array for the vet
    const updatedVet = await Vet.findByIdAndUpdate(
      vetId,
      { $push: { medicalRecords: savedMedicalRecord._id } },
      { new: true }
    );

    if (!updatedVet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    // Optionally, update medicalRecords array for the specific record (if needed)
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { $push: { medicId: savedMedicalRecord._id } },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Return the saved MedicalRecord
    res.status(201).json(savedMedicalRecord);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all medical records for the authenticated user (vet)
router.get('/all', verifyToken, async (req: Request, res: Response) => {
  try {
    const medics = await medicalRecord.find({ vetId: req.userId }); // Assuming vetId is obtained from the authenticated user
    res.status(200).json(medics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
