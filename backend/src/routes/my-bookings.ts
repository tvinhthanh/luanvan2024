import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { VetCType, BookingType } from "../shared/types";
import Vet from "../models/vet";
import Booking from "../models/booking";
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
    const newBooking = new Booking({
      _id: uuidv4(),
      ownerId,
      petId,
      phoneOwner,
      date,
      status,
      vetId
    });
    await newBooking.save();
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({ error: 'Vet not found' });
    }
    vet.booking.push(newBooking);
    await vet.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;
