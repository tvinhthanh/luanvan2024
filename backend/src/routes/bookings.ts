import express from "express";
import verifyToken from "../middleware/auth";
import Schedule from "../models/schedule";
import { Error } from "mongoose";
import Booking from "../models/booking";

const router = express.Router();

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
    const bookings = await Booking.findById({ _id: bookingId }); 
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
    // Đếm số lượng tài liệu trong collection
    const count = await Schedule.countDocuments();
    // Tạo ID mới bằng cách thêm 1 vào số lượng tài liệu đã đếm được
    const newId = (count + 1).toString();
    return newId;
  } catch (error) {
    console.error("Error getting next schedule ID:", error);
    throw error;
  }
};

// Endpoint booking lịch hẹn
router.post("/booking/addSchedule/", async (req, res) => {
  try {
    const { owner_id, vet_id, pet_id, note, datetime } = req.body;

    // Lấy ID tiếp theo
    const nextId = await getNextIdSchedule();

    const newSchedule = new Schedule({
      _id: nextId.toString(), // Chuyển đổi sang kiểu String
      owner_id,
      vet_id,
      pet_id,
      note,
      datetime,
      status: "pending", // Đặt trạng thái là "pending"
    });

    await newSchedule.save(); // Lưu lịch hẹn mới vào database
    res
      .status(201)
      .json({ message: "Thêm lịch hẹn thành công", schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ error: Error.messages });
  }
});

// Endpoint thêm một lịch hẹn từ vet_id
router.post("/booking/addSchedule/:vet_id", async (req, res) => {
  try {
    const vet_id = req.params.vet_id; // Lấy vet_id từ URL params
    const { owner_id, pet_id, note, datetime } = req.body;

    // Lấy ID tiếp theo
    const nextId = await getNextIdSchedule();

    const newSchedule = new Schedule({
      _id: nextId.toString(), // Chuyển đổi sang kiểu String
      owner_id,
      vet_id,
      pet_id,
      note,
      datetime,
      status: "pending", // Đặt trạng thái là "pending"
    });

    await newSchedule.save(); // Lưu lịch hẹn mới vào database
    res.status(201).json({ message: "Thêm lịch hẹn thành công", schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ error: Error.messages });
  }
});

// Endpoint hiển thị lịch cho từng pet
router.get("/booking/showForPet/:owner_id/:pet_id", async (req, res) => {
  const { owner_id, pet_id } = req.params;

  try {
    // Tìm kiếm lịch trình dựa trên owner_id và pet_id
    const schedules = await Schedule.find(
      { owner_id, pet_id },
      "note datetime"
    );

    if (schedules.length === 0) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy lịch trình cho owner_id và pet_id cung cấp",
        });
    }

    // Trả về lịch trình đã tìm thấy
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: Error.messages });
  }
});

export default router;
