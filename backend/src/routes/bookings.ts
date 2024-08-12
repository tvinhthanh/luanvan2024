import express from "express";
import verifyToken from "../middleware/auth";
import Schedule from "../models/schedule";
import Booking from "../models/booking";
import { Server } from "socket.io";
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

export default (io: Server) => {
  // GET all bookings
  router.get("/", async (req, res) => {
    try {
      const bookings = await Booking.find({});
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE a booking by ID
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET a booking by ID
  router.get('/:bookingId', async (req, res) => {
    const { bookingId } = req.params;

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // PATCH booking status by ID
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
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT (update) a booking by ID
  router.put('/:bookingId', verifyToken, async (req, res) => {
    const { bookingId } = req.params;
    const { vetId, ownerId, petId, phoneOwner, date, status } = req.body;

    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { vetId, ownerId, petId, phoneOwner, date, status },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  const getNextIdSchedule = async () => {
    try {
      const count = await Schedule.countDocuments();
      const newId = (count + 1).toString();
      return newId;
    } catch (error) {
      console.error("Error getting next schedule ID:", error);
      throw error;
    }
  };

  // POST (create) a new schedule
  router.post("/booking/addSchedule/", async (req, res) => {
    try {
      const { owner_id, vet_id, pet_id, note, datetime } = req.body;
      const nextId = await getNextIdSchedule();

      const newSchedule = new Schedule({
        _id: nextId,
        owner_id,
        vet_id,
        pet_id,
        note,
        datetime,
        status: "pending",
      });

      await newSchedule.save();
      res.status(201).json({ message: "Thêm lịch hẹn thành công", schedule: newSchedule });
    } catch (error) {
      console.error('Error adding schedule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST (create) a new schedule with vet_id from params
  router.post("/booking/addSchedule/:vet_id", async (req, res) => {
    try {
      const vet_id = req.params.vet_id;
      const { owner_id, pet_id, note, datetime } = req.body;
      const nextId = await getNextIdSchedule();

      const newSchedule = new Schedule({
        _id: nextId,
        owner_id,
        vet_id,
        pet_id,
        note,
        datetime,
        status: "pending",
      });

      await newSchedule.save();
      res.status(201).json({ message: "Thêm lịch hẹn thành công", schedule: newSchedule });
    } catch (error) {
      console.error('Error adding schedule:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET schedules for a specific pet and owner
  router.get("/booking/showForPet/:owner_id/:pet_id", async (req, res) => {
    const { owner_id, pet_id } = req.params;

    try {
      const schedules = await Schedule.find(
        { owner_id, pet_id },
        "note datetime"
      );

      if (schedules.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch trình cho owner_id và pet_id cung cấp" });
      }

      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
// POST (create) a new booking
router.post("/", async (req, res) => {
  try {
    const { vetId, ownerId, petId, phoneOwner, date, status } = req.body;

    // Tạo một bản ghi booking mới với các dữ liệu từ request body
    const newBooking = new Booking({
      _id: uuidv4(), // Generate a unique ID for the booking
      vetId,
      ownerId,
      petId,
      phoneOwner,
      date,
      status : 2
    });
    // Lưu booking mới vào cơ sở dữ liệu
    await newBooking.save();
    io.emit('newBooking', newBooking);

    // Trả về booking mới tạo và trạng thái thành công
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  return router;
};
