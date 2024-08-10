import express, { request, Request, Response } from "express";
import Medic from "../models/medical";
const router = express.Router();

// Endpoint to fetch Medic records by petId and vetId
router.get('/show/:petId/:vetId', async (req, res) => {
    const { petId, vetId } = req.params;
  
    try {
      // Find Medic records with the specified petId and vetId
      const medicRecords = await Medic.find({ petId, vetId });
  
      if (!medicRecords.length) {
        return res.status(404).json({ message: 'No medical records found for the specified petId and vetId.' });
      }
  
      res.status(200).json(medicRecords);
    } catch (error) {
      console.error('Error fetching Medic records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
export default router;