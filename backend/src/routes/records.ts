// Import necessary modules
import express from 'express';
import { Request, Response } from 'express';
import Record from '../models/records'; // Import your Mongoose model here
import verifyToken from '../middleware/auth';
import Vet from '../models/vet';

// Create an Express Router
const router = express.Router();

// GET all records
router.get('/:vetId',verifyToken, async (req: Request, res: Response) => {
    const {vetId} = req.params;
  try {
    const records = await Record.find({vetId});
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET record by ID
router.get('/:recordId', async (req: Request, res: Response) => {
  const { recordId } = req.params;
  try {
    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Create a new record
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { petId, ownerId, vetId } = req.body;

    // Validate required fields
    if (!petId || !ownerId || !vetId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if there's already a record for this pet with the same vetId
    const existingRecord = await Record.findOne({ petId, vetId }).lean();
    if (existingRecord) {
      return res.status(400).json({ error: 'A record already exists for this pet with this vet.' });
    }

    // Generate a unique ID for the new record
    const lastRecord = await Record.findOne().sort({ _id: -1 }).lean();
    let newId = 1; // Default ID starting from 1

    if (lastRecord && typeof lastRecord._id === 'string') {
      // Extract the number from the _id and increment it
      newId = parseInt(lastRecord._id.replace('record', ''), 10) + 1;
    }

    const newRecord = new Record({
      _id: `record${newId}`,
      petId,
      ownerId,
      vetId,
    });

    // Save the new Record
    await newRecord.save();

    // Update the vet with the new record
    const updatedVet = await Vet.findByIdAndUpdate(
      vetId,
      { $push: { record: newRecord._id } },
      { new: true }
    );

    if (!updatedVet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    // Return the newly created record
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/by-pet/:petId', async (req, res) => {
  const { petId } = req.params;

  try {
    const records = await Record.find({ petId });
    res.json(records);
  } catch (error) {
    console.error("Error fetching records by pet:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch all records
router.get('/', verifyToken, async (req: Request, res: Response) => {
    const { vetId } = req.params;

    try {
      const records = await Record.find({vetId});
      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// PUT update an existing record
router.put('/:recordId', async (req: Request, res: Response) => {
  const { recordId } = req.params;
  try {
    const updatedRecord = await Record.findByIdAndUpdate(recordId, req.body, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE delete a record
router.delete('/:recordId', async (req: Request, res: Response) => {
  const { recordId } = req.params;
  try {
    const deletedRecord = await Record.findByIdAndDelete(recordId);
    if (!deletedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
export default router;
