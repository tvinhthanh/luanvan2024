import express, { Request, Response } from 'express';
import ServiceType from '../models/service';
import verifyToken from '../middleware/auth';
import Vet from '../models/vet';

const router = express.Router();

// Create a new service
router.post('/:vetId', verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, price, duration, available } = req.body;
    const id_vet = req.params.vetId; // Extract vetId from the URL parameter

    // Check if a service with the same name already exists for the vet
    const existingService = await ServiceType.findOne({ name, id_vet });
    if (existingService) {
      return res.status(400).json({ error: 'Service with this name already exists for this vet.' });
    }

    // Create a new service instance
    const newService = new ServiceType({ name, price, duration, available, id_vet });

    // Save the new service to the database
    const savedService = await newService.save();

    // Find the vet and add the new service to their services array
    const vet = await Vet.findById(id_vet);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }

    // Check if the service is already in vet's service array
    if (!vet.service?.includes(savedService._id)) {
      vet.service?.push(savedService._id);
      await vet.save();
    }

    // Respond with the saved service object
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/:vetId', verifyToken, async (req, res) => {
  const { vetId } = req.params;

  try {
    const services = await ServiceType.find({ id_vet: vetId }); // Lọc dịch vụ theo id_vet
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/',verifyToken, async (req: Request, res: Response) => {
  try {
    const services = await ServiceType.find();
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:vetId/chart',verifyToken, async (req: Request, res: Response) => {
  const { vetId } = req.params;
  try {
    const services = await ServiceType.find({ id_vet: vetId },'name time'); // Fetch only name and time for the given vetId
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


// Get a service by id
router.get('/:id',verifyToken, async (req: Request, res: Response) => {
  try {
    const service = await ServiceType.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a service by id
router.put('/:id',verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, duration, available } = req.body;
  
  try {
    const updatedService = await ServiceType.findByIdAndUpdate(
      id,
      { name, price, duration, available },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ error: "Internal server error"  });
  }
});
// Delete a service by id
router.delete('/:id',verifyToken, async (req: Request, res: Response) => {
  try {
    const service = await ServiceType.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
// Show all services available true follow vet_id
router.get("/show/:id_vet", async (req, res) => {
  const id_vet = req.params.id_vet;
  try {
    const services = await ServiceType.find({ id_vet, available: true });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
