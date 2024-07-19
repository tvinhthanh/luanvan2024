import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Invoice from '../models/invoice';
import medicalRecord from '../models/medical';
import verifyToken from '../middleware/auth';

const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
  const { medicalRecordId, ownerId, vetId, petName, medications, services, total, createAt } = req.body;

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
      ownerId,
      vetId,
      petName,
      medications: mappedMedications,
      services: mappedServices,
      createAt: new Date(createAt),
      total,
    });

    // Save invoice to database
    const savedInvoice = await newInvoice.save();

    // Log the saved invoice for debugging
    console.log('Saved Invoice:', savedInvoice);

    // Update medical record to indicate it has an invoice
    const updatedMedicalRecord = await medicalRecord.findOneAndUpdate(
      { _id: medicalRecordId },
      { hasInvoice: true },
      { new: true }
    );

    // Respond with the saved invoice object
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Error creating invoice', details: error });
  }
});

  
// Route để lấy tất cả các hóa đơn dựa trên vetId
router.get('/:vetId', async (req : Request, res : Response ) => {
  const { vetId } = req.params;

  try {
    const invoices = await Invoice.find({ vetId });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});
// Route để lấy danh sách tất cả các hóa đơn
router.get('/', async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().populate('medications').populate('services');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching invoices' });
  }
});

// Route để lấy thông tin chi tiết của một hóa đơn theo ID
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

// Route để cập nhật thông tin của một hóa đơn theo ID
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

// Route để xóa một hóa đơn theo ID
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

export default router;
