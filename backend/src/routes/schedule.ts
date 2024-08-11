import express, { Request, Response } from "express";
import Booking from "../models/booking";
import UsersApp from "../models/usersApp";
import Schedule from "../models/schedule";
import mongoose from "mongoose";

const router = express.Router();
// Endpoint hiển thị lịch hẹn cho calendar
router.get('/appointments/calendar/:email', async (req: Request, res: Response) => {
  const email: string = req.params.email;

  console.log(`Fetching appointments for user with email: ${email}`);

  try {
    // Find the user by email
    const user = await UsersApp.findOne({ email });

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User found: ${user}`);

    // Fetch bookings using the ownerId from the user with status = 2 or 3
    const bookings = await Booking.find({
      ownerId: user._id,
      status: { $in: [2, 3] }, // Filter bookings with status 2 or 3
    }).populate('vetId', 'name'); // Populate vetId with name

    // Check if there are no bookings found
    if (bookings.length === 0) {
      console.log(`No bookings found for user: ${user._id} with status 2 or 3`);
      return res.status(404).json({ message: 'No bookings found for the given user.' });
    }

    console.log(`Bookings found:`, bookings);

    // Return the bookings if found
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST endpoint để thêm một sự kiện mới
router.post('/addEvent', async (req, res) => {
  const { owner_id, booking_id, title, description, datetime, type } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!owner_id || !booking_id || !title || !datetime || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Kiểm tra xem booking_id đã tồn tại chưa
    const existingSchedule = await Schedule.findOne({ booking_id });
    if (existingSchedule) {
      return res.status(409).json({ error: 'Booking ID already exists' });
    }

    // Tạo một instance của Schedule
    const newSchedule = new Schedule({
      _id: new mongoose.Types.ObjectId().toString(), // Tạo một ID mới
      owner_id,
      booking_id,
      title,
      description,
      datetime,
      type,
    });

    // Lưu sự kiện vào cơ sở dữ liệu
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
