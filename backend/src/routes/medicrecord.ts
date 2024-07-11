import express, { Request, Response } from 'express';
import medicalRecord from '../models/medicalRecord';
import vet from '../models/vet';
import verifyToken from '../middleware/auth';
import Medic from '../models/medicalRecord';
import Vet from '../models/vet';
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

// Get a specific medical record by ID (for vet)
router.get('/:medicId', verifyToken, async (req: Request, res: Response) => {
  const { medicId } = req.params;
  try {
    const medic = await Medic.findById(medicId);
    
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
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const deletedMedic = await medicalRecord.findOneAndDelete({ _id: req.params.id, vetId: req.userId }); // Assuming vetId is obtained from the authenticated user
    if (!deletedMedic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Create a new medical record
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { vetId, petId, ownerId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    const newMedicalRecord = new medicalRecord({
      _id: uuidv4(), 
      petId,
      ownerId,
      vetId, // Assuming vetId is obtained from the authenticated user
      visitDate,
      reasonForVisit,
      symptoms,
      diagnosis,
      treatmentPlan,
      medications,
      notes,
    });

    const savedMedicalRecord = await newMedicalRecord.save();
    res.status(201).json(savedMedicalRecord);
    
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    vet.medicalRecord.push(newMedicalRecord);
    await vet.save();

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
