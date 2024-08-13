import express, { Request, Response } from "express";
import Booking from "../models/booking";
import UsersApp from "../models/usersApp";
import Schedule from "../models/schedule";
import mongoose from "mongoose";

const router = express.Router();

// Endpoint hiển thị lịch hẹn cho lịch biểu theo từng người dùng
router.get('/appointment/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await UsersApp.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const schedules = await Schedule.find({ owner_id: user._id, type: "LH" });
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found with type "LH"' });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
