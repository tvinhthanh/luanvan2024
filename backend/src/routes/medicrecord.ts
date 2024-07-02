import express, { Request, Response } from 'express';
import medicalRecord from '../models/medicalRecord';
import vet from '../models/vet';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.get('/:vetId', verifyToken, async (req, res) => {
  const { vetId } = req.params;

  try {
    const services = await medicalRecord.find({ id_vet: vetId }); // Lọc dịch vụ theo id_vet
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/', verifyToken, async (req: Request, res: Response) => {
  const vetId = req.query.vet_id as string; // Assuming vet_id is a string
  try {
    // Find the vet document to get userId
    const vetDoc = await vet.findOne({ _id: vetId });
    console.log(vetId)

    if (!vetDoc) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    // Query medical records based on vetId
    const medicalRecords = await medicalRecord.find({ vetId });
    res.json(medicalRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
});


// Create a new medical record
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { petId, ownerId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    const newMedicalRecord = new medicalRecord({
      petId,
      ownerId,
      vetId: req.userId, // Assuming vetId is obtained from the authenticated user
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

// Get a specific medical record by ID (for vet)
router.get('/:id_vet', verifyToken, async (req: Request, res: Response) => {
  try {
    const medic = await medicalRecord.findOne({ _id: req.params.id, vetId: req.userId }); // Assuming vetId is obtained from the authenticated user
    if (!medic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    res.status(200).json(medic);
  } catch (error) {
    console.error(error);
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

export default router;
