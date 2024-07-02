import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { VetCType, BookingType } from "../shared/types";
import Vet from "../models/vet";
import Booking from "../models/booking";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({
      vetId: req.vetId,
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Unable to fetch bookings:", error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});
router.get("/all", async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({
      vetId: req.vetId,
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Unable to fetch bookings:", error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});
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

export default router;
