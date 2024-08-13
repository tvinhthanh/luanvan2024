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
    // Fetch all schedules for the user without filtering by type
    const schedules = await Schedule.find({ owner_id: user._id });
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found' });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint thêm sự kiện mới
router.post('/events/add/:email', async (req, res) => {
  const { email } = req.params;
  const { title, description, datetime } = req.body; // Removed booking_id

  try {
    // Find the user by email
    const user = await UsersApp.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new schedule with type set to "E"
    const newSchedule = new Schedule({
      _id: new mongoose.Types.ObjectId().toHexString(),
      owner_id: user._id,
      title,
      description,
      datetime,
      type: "E"  // Set the type to "E"
    });

    // Save the new schedule
    await newSchedule.save();

    res.status(201).json({ message: 'New schedule created', schedule: newSchedule });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Endpoint update sự kiện
router.put('/events/update/:email/:scheduleId', async (req, res) => {
  const { email, scheduleId } = req.params;
  const { title, description, datetime } = req.body;

  try {
    // Find the user by email
    const user = await UsersApp.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and update the schedule
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, owner_id: user._id },
      { title, description, datetime },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//Endpoint delete sự kiện
router.delete('/events/delete/:email/:scheduleId', async (req, res) => {
  const { email, scheduleId } = req.params;

  try {
    // Find the user by email
    const user = await UsersApp.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and delete the schedule
    const deletedSchedule = await Schedule.findOneAndDelete({
      _id: scheduleId,
      owner_id: user._id
    });

    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
