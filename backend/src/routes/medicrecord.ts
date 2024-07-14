import express, { Request, Response } from 'express';
import medicalRecord from '../models/medical';
import vet from '../models/vet';
import verifyToken from '../middleware/auth';
import Medic from '../models/medical';
import Vet from '../models/vet';
import Record from '../models/records';
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
router.delete('/del/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const deletedMedic = await medicalRecord.findOneAndDelete({ _id: req.params.id, vetId: req.userId });
    if (!deletedMedic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//create
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { recordId, vetId, petId, ownerId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    // Find existing medical record for the pet
    const existingRecord = await Record.findOne({ petId });

    // Check if existingRecord is null or undefined
    if (!existingRecord) {
      return res.status(400).json({ error: "Pet doesn't have a medical record. Please create one first." });
    }

    // Create a new instance of MedicalRecord
    const newMedicalRecord = new medicalRecord({
      _id: uuidv4(),
      petId,
      ownerId,
      vetId,
      recordId,
      visitDate,
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
    const updatedPet = await Record.findByIdAndUpdate(
      existingRecord._id,
      { $push: { medicId: savedMedicalRecord._id } },
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

    // Update medicalRecords array for the record (if needed)
    const updatedRecord = await Record.findByIdAndUpdate(
      recordId,
      { $push: { medicalRecords: savedMedicalRecord._id } },
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
