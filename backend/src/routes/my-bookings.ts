import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { VetCType, BookingType } from "../shared/types";
import Vet from "../models/vet";
import Booking from "../models/booking";
import UsersApp from "../models/usersApp";
import mongoose from "mongoose";
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// /api/my-bookings
// router.get("/", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const bookings = await Booking.find({
//       vetId: req.vetId,
//     });

//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("Unable to fetch bookings:", error);
//     res.status(500).json({ message: "Unable to fetch bookings" });
//   }
// });
// router.get("/all", async (req: Request, res: Response) => {
//   try {
//     const bookings = await Booking.find({
//       vetId: req.vetId,
//     });

//     res.status(200).json(bookings);
//   } catch (error) {
//     console.error("Unable to fetch bookings:", error);
//     res.status(500).json({ message: "Unable to fetch bookings" });
//   }
// });
// GET /api/my-bookings/:vetId
router.get("/:vetId", verifyToken, async (req: Request, res: Response) => {
  const { vetId } = req.params;

  try {
    const bookings = await Booking.find({ vetId }); 
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.patch("/:bookingId/status", async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (typeof status !== "number") {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
// GET /api/my-bookings/:bookingId
router.get("/:bookingId", verifyToken, async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const bookings = await Booking.findById({ bookingId }); 
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// POST a new booking
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { vetId, ownerId, petId, phoneOwner, date, status } = req.body;
  
  try {
    // Create a new booking instance
    const newBooking = new Booking({
      _id: uuidv4(), // Generate a unique ID for the booking
      ownerId,
      petId,
      phoneOwner,
      date,
      status,
      vetId
    });

    // Save the new booking to the database
    await newBooking.save();

    // Find the vet and add the new booking to their bookings
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }
    
    // Check if booking is already in vet's bookings array
    if (!vet.booking.includes(newBooking._id)) {
      vet.booking.push(newBooking._id);
      await vet.save();
    }

    // Respond with the newly created booking
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to add new booking
router.post('/add/:vetID/:email/:petID', async (req: Request, res: Response) => {
  try {
    const { vetID, email, petID } = req.params;
    const { note, date, status } = req.body;

    // Find user by email to get _id and phone
    const user = await UsersApp.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new Booking instance
    const newBooking = new Booking({
      _id: new mongoose.Types.ObjectId().toHexString(),
      vetId: vetID,
      ownerId: user._id,
      petId: petID,
      date,
      note,
      phoneOwner: user.phone,
      status: 1, // Default status to 1 (Pending)
    });

    // Save the new booking to the database
    const savedBooking = await newBooking.save();

    // Respond with the saved booking object
    res.status(201).json(savedBooking);
  } catch (error) {
    // Handle errors
    console.error('Error adding booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint để hiển thị lịch hẹn theo vetId và petId
router.get('/appointments/:petId/:vetId', async (req, res) => {
  const { petId, vetId } = req.params;

  try {
    const bookings = await Booking.find({ petId, vetId });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for the given petId and vetId.' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
