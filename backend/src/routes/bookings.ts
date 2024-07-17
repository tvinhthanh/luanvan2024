import express from "express";
import verifyToken from "../middleware/auth";
import Schedule from "../models/schedule";
import Owner from "../models/owner";
import Pet from "../models/pet";
import { Error } from "mongoose";
import Breed from "../models/breed";
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
// // get to update a booking by ID
// router.push('/:bookingId', verifyToken, async (req, res) => {
//   const { bookingId } = req.params;

//   try {
//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     console.error('Error fetching booking:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
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
// Endpoint hiển thị sự kiện trong calendar
router.get("/booking/showSchedule/:id", async (req, res) => {
  const ownerId = req.params.id;

  try {
    // Tìm tất cả các sự kiện trong lịch của chủ nhân có id tương ứng
    const ownerSchedules = await Schedule.find({ owner_id: ownerId });

    // Tạo một mảng để lưu trữ thông tin về sự kiện
    const events = [];

    // Duyệt qua mỗi sự kiện trong lịch
    for (const ownerSchedule of ownerSchedules) {
      // Tìm thông tin về thú cưng dựa trên pet_id của sự kiện
      const petInfo = await Pet.findById(ownerSchedule.pet_id);

      // Kiểm tra xem thú cưng có tồn tại không
      if (petInfo) {
        // Thêm thông tin về sự kiện vào mảng events
        events.push({
          name: petInfo.name,
          note: ownerSchedule.note,
          datetime: ownerSchedule.datetime,
        });
      }
    }
    // Trả về danh sách các sự kiện
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching owner's schedule:", error);
    res.status(500).json({ error: "Internal server error" });
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


// Endpoint hiển thị toàn bộ lịch hẹn
router.get("/booking/showAllSchedules", async (req, res) => {
  try {
    const allSchedules = await Schedule.find({}).lean(); // Sử dụng lean để chuyển kết quả sang đối tượng JavaScript đơn giản

    // Lặp qua mỗi lịch hẹn và lấy thông tin tên chủ nhân và thú cưng
    for (const scheduleItem of allSchedules) {
      const ownerInfo = await Owner
        .findById(scheduleItem.owner_id)
        .select("name")
        .lean();
      const petInfo = await Pet
        .findById(scheduleItem.pet_id)
        .select("name")
        .lean();

      // Gán thông tin tên chủ nhân và thú cưng vào lịch hẹn tương ứng
      scheduleItem.owner_id = ownerInfo ? ownerInfo.name : "Unknown";
      scheduleItem.pet_id = petInfo ? petInfo.name : "Unknown";
    }

    res.status(200).json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint hiển thị toàn bộ lịch hẹn dựa trên vet_id
router.get("/booking/showAllSchedules/:vet_id", async (req, res) => {
  const vetId = req.params.vet_id;
  try {
    const allSchedules = await Schedule.find({ vet_id: vetId }).lean();

    for (const scheduleItem of allSchedules) {
      const ownerInfo = await Owner
        .findById(scheduleItem.owner_id)
        .select("name")
        .lean();
      const petInfo = await Pet
        .findById(scheduleItem.pet_id)
        .select("name")
        .lean();

      scheduleItem.owner_id = ownerInfo ? ownerInfo.name : "Unknown";
      scheduleItem.pet_id = petInfo ? petInfo.name : "Unknown";
    }

    res.status(200).json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint hiển thị chi tiết thông tin pet dựa trên vet_id, pet_id, schedule_id
router.get("/booking/showPetDetail/:vet_id/:pet_id/:schedule_id", async (req, res) => {
  const { vet_id, pet_id, schedule_id } = req.params;

  try {
    // Tìm lịch hẹn tương ứng với vet_id, pet_id, schedule_id
    const petSchedule = await Schedule.findOne({ vet_id, pet_id, _id: schedule_id });

    if (!petSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Lấy thông tin về chủ nhân (owner) từ owner_id của lịch hẹn
    const ownerInfo = await Owner
      .findById(petSchedule.owner_id)
      .select("name")
      .lean();

    // Lấy thông tin về pet từ pet_id của lịch hẹn
    const petInfo = await Pet.findById(pet_id).lean();

    // Kiểm tra xem chủ nhân và pet có tồn tại không
    if (!ownerInfo || !petInfo) {
      return res.status(404).json({ error: "Owner or pet not found" });
    }

    // Lấy thông tin về breed_type từ breed_id của pet
    const breedInfo = await Breed.findById(petInfo.breed_id).select("name").lean();

    // Trả về chi tiết thông tin pet bao gồm cả status từ lịch hẹn, breed_type và datetime
    const petDetail = {
      nameCustomer: ownerInfo.name,
      petName: petInfo.name,
      age: petInfo.age,
      weigh: petInfo.weigh,
      status: petSchedule.status,
      note: petSchedule.note,
      breed_type: breedInfo ? breedInfo.name : "Unknown", // Thêm thông tin về breed_type vào kết quả trả về
      datetime: petSchedule.datetime // Thêm thông tin về datetime vào kết quả trả về
    };

    res.status(200).json(petDetail);
  } catch (error) {
    console.error("Error fetching pet details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint hiển thị chi tiết thông tin pet dựa trên vet_id, pet_id
router.get("/booking/showPetDetail/:vet_id/:pet_id", async (req, res) => {
  const { vet_id, pet_id } = req.params;

  try {
    // Tìm lịch hẹn tương ứng với vet_id và pet_id
    const petSchedule = await Schedule.findOne({ vet_id, pet_id });

    if (!petSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Lấy thông tin về chủ nhân (owner) từ owner_id của lịch hẹn
    const ownerInfo = await Owner
      .findById(petSchedule.owner_id)
      .select("name")
      .lean();

    // Lấy thông tin về pet từ pet_id của lịch hẹn
    const petInfo = await Pet.findById(pet_id).lean();

    // Kiểm tra xem chủ nhân và pet có tồn tại không
    if (!ownerInfo || !petInfo) {
      return res.status(404).json({ error: "Owner or pet not found" });
    }

    // Lấy thông tin về breed_type từ breed_id của pet
    const breedInfo = await Breed.findById(petInfo.breed_id).select("name").lean();

    // Trả về chi tiết thông tin pet bao gồm cả status từ lịch hẹn, breed_type và datetime
    const petDetail = {
      nameCustomer: ownerInfo.name,
      petName: petInfo.name,
      age: petInfo.age,
      weigh: petInfo.weigh,
      status: petSchedule.status,
      note: petSchedule.note,
      breed_type: breedInfo ? breedInfo.name : "Unknown", // Thêm thông tin về breed_type vào kết quả trả về
      datetime: petSchedule.datetime // Thêm thông tin về datetime vào kết quả trả về
    };

    res.status(200).json(petDetail);
  } catch (error) {
    console.error("Error fetching pet details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint cập nhật status và note lịch dựa vào scheduleId
router.put("/booking/updateSchedule/:scheduleId", async (req, res) => {
  const { scheduleId } = req.params;
  const { note, status } = req.body;

  try {
    // Kiểm tra xem lịch có tồn tại trong cơ sở dữ liệu không
    const existingSchedule = await Schedule.findById(scheduleId);
    if (!existingSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Cập nhật thông tin lịch
    existingSchedule.note = note || existingSchedule.note;
    existingSchedule.status = status || existingSchedule.status;
    await existingSchedule.save();

    // Trả về thông báo cập nhật thành công
    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Internal server error" });
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
