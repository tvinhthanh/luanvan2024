import { Request, Response } from "express";
import Booking from "../models/booking";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.userId });
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      if (booking.userId.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized action" });
      }
  
      await booking.deleteOne(); // Sử dụng phương thức deleteOne() để xóa booking
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  };