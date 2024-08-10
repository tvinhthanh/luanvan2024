import express, { Request, Response } from "express";
import Booking from "../models/booking";
import UsersApp from "../models/usersApp";

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

    // Fetch bookings using the ownerId from the user
    const bookings = await Booking.find({ ownerId: user._id }).populate('vetId', 'name'); // Populate vetId with name

    // Check if there are no bookings found
    if (bookings.length === 0) {
      console.log(`No bookings found for user: ${user._id}`);
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

export default router;
