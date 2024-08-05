import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/invoice';
import MedicalRecord from '../models/medical'; // Corrected model import
import verifyToken from '../middleware/auth';
import Medication from '../models/medications';
import Service from '../models/service';

const router = express.Router();

// Fixing the demSoThuocDaDung function
const demSoThuocDaDung = async (medId: string) => {
  try {
    const count = await Invoice.countDocuments({ medications: { $elemMatch: { _id: medId } } });
    return count;
  } catch (err) {
    console.log(err);
    return null; // Ensure function returns null on error
  }
};

router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { medicalRecordId, vetId, medications, services, total, createAt } = req.body;

  try {
    // Validate medications array
    if (!Array.isArray(medications) || medications.some(med => typeof med !== 'object' || !med._id)) {
      return res.status(400).json({ error: 'Invalid medications array.' });
    }

    // Validate services array
    if (!Array.isArray(services) || services.some(serv => typeof serv !== 'object' || !serv._id)) {
      return res.status(400).json({ error: 'Invalid services array.' });
    }

    // Map medications and services to convert _id strings to ObjectId
    const mappedMedications = medications.map(med => ({ _id: med._id }));
    const mappedServices = services.map(serv => ({ _id: serv._id }));

    // Create new invoice object
    const newInvoice = new Invoice({
      medicalRecordId,
      vetId,
      medications: mappedMedications,
      services: mappedServices,
      createAt: new Date(createAt),
      total,
    });

    // Save invoice to database
    const savedInvoice = await newInvoice.save();

    // Update medical record to indicate it has an invoice
    await MedicalRecord.findByIdAndUpdate(
      medicalRecordId,
      { hasInvoice: true },
      { new: true }
    );

    // Update medications quantities and time
    for (const med of medications) {
      await Medication.findByIdAndUpdate(
        med._id,
        { $inc: { quantity: -1 } }, // Ensure quantity and time are numeric
        { new: true, runValidators: true } // Ensure the update is returned and validation is run
      );
    }
    for (const med of medications) {
      await Medication.findByIdAndUpdate(
        med._id,
        { $inc: { time: 1 } }, // Ensure quantity and time are numeric
        { new: true, runValidators: true } // Ensure the update is returned and validation is run

      );
    }
    // Update services time
    for (const serv of services) {
      await Service.findByIdAndUpdate(
        serv._id,
        { $inc: { time: 1 } }, // Ensure time is numeric
        { new: true, runValidators: true } // Ensure the update is returned and validation is run

      );
    }

    // Respond with the saved invoice object
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Error creating invoice', details: error });
  }
});

// Route to get all invoices based on vetId
router.get('/:vetId', async (req: Request, res: Response) => {
  const { vetId } = req.params;
  if (!vetId) {
    return res.status(400).json({ error: 'Vet ID is required' });
  }
  try {
    const invoices = await Invoice.find({ vetId });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// Route to get all invoices
router.get('/', async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().populate('medications').populate('services');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// Route to get invoice details by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id).populate('medications').populate('services');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

// Route to update invoice details by ID
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { medicalRecordId, ownerName, petName, medications, services, total } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { medicalRecordId, ownerName, petName, medications, services, total },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Error updating invoice' });
  }
});

// Route to delete an invoice by ID
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting invoice' });
  }
});

// API endpoint to get invoice count based on date range
router.get('/total', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let matchCondition;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === 'day') {
      matchCondition = {
        createAt: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      };
    } else if (type === 'week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      matchCondition = {
        createAt: {
          $gte: weekStart,
          $lt: weekEnd,
        },
      };
    } else if (type === 'month') {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

      matchCondition = {
        createAt: {
          $gte: monthStart,
          $lt: monthEnd,
        },
      };
    } else {
      return res.status(400).send({ message: 'Invalid type' });
    }
    const invoiceCount = await Invoice.countDocuments(matchCondition);
    res.json({ count: invoiceCount });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route to get medication usage count
router.get('/medications/:medId', async (req: Request, res: Response) => {
  const { medId } = req.params;

  try {
    const count = await demSoThuocDaDung(medId);
    if (count !== null) {
      res.status(200).json({ count, medId });
    } else {
      res.status(500).json({ error: 'Error counting documents' });
    }
  } catch (error) {
    console.error('Error getting medication count:', error);
    res.status(500).json({ error: 'Error getting medication count' });
  }
});

export default router;
