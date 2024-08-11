import express, { Request, Response } from 'express';
import medicalRecord from '../models/medical';
import vet from '../models/vet';
import verifyToken from '../middleware/auth';
import Medic from '../models/medical';
import Vet from '../models/vet';
import Pet from '../models/pet';
import Booking from '../models/booking';
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
    const { medicId } = req.params; // Extracting the medicId from the route parameters
    const deletedMedic = await medicalRecord.findOneAndDelete({ _id: medicId }); // Use _id to match MongoDB's default identifier

    if (!deletedMedic) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.status(200).json({ message: 'Medical record deleted' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
});
//create with booking
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { vetId, petId, ownerId, bookingsId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    // Validate required fields
    if ( !vetId || !petId || !ownerId || !reasonForVisit) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate medications array
    if (!Array.isArray(medications) || medications.some(med => typeof med !== 'object' || !med._id)) {
      return res.status(400).json({ error: 'Invalid medications array.' });
    }
    // Create a new instance of MedicalRecord
    const newMedicalRecord = new medicalRecord({
      _id: uuidv4(), // Generate a new UUID for the medical record
      petId,
      ownerId,
      vetId,
      visitDate:  new Date(), // Use provided visitDate or current date
      reasonForVisit,
      symptoms,
      diagnosis,
      treatmentPlan,
      medications,
      bookingsId,
      notes,
    });

    // Save the new MedicalRecord
    const savedMedicalRecord = await newMedicalRecord.save();

    // Update medicalRecords array for the pet
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $push: { medic_id: savedMedicalRecord._id } },
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

    // Update the Booking status to "4"
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingsId,
      { status: "3" },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Return the saved MedicalRecord
    res.status(201).json(savedMedicalRecord);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//create without booking
router.post('/o', verifyToken, async (req: Request, res: Response) => {
  try {
    const { vetId, petId, ownerId, bookingsId, visitDate, reasonForVisit, symptoms, diagnosis, treatmentPlan, medications, notes } = req.body;

    // Validate required fields
    if ( !vetId || !petId || !ownerId || !reasonForVisit) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate medications array
    if (!Array.isArray(medications) || medications.some(med => typeof med !== 'object' || !med._id)) {
      return res.status(400).json({ error: 'Invalid medications array.' });
    }
    // Create a new instance of MedicalRecord
    const newMedicalRecord = new medicalRecord({
      _id: uuidv4(), // Generate a new UUID for the medical record
      petId,
      ownerId,
      vetId,
      visitDate:  new Date(), // Use provided visitDate or current date
      reasonForVisit,
      symptoms,
      diagnosis,
      treatmentPlan,
      medications,
      bookingsId,
      notes,
    });

    // Save the new MedicalRecord
    const savedMedicalRecord = await newMedicalRecord.save();

    // Update medicalRecords array for the pet
    const updatedPet = await Pet.findByIdAndUpdate(
      petId,
      { $push: { medic_id: savedMedicalRecord._id } },
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
router.get('/:vetId/:petId', async (req, res) => {
  const { petId , vetId } = req.params;

  try {
    const records = await medicalRecord.find({vetId, petId });
    res.json(records);
  } catch (error) {
    console.error("Error fetching records by pet:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
