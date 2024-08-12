import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import petRoutes from "./routes/pet";
import ownerRoutes from "./routes/owner";
import bookingRoutes from "./routes/my-bookings";
import myVetRoutes from "./routes/my-vet";
import breedRoutes from "./routes/breed";
import breedTypeRoutes from "./routes/breedType";
import medicalRecordRoutes from "./routes/medicrecord";
import serviceRoutes from "./routes/service";
import vetRoutes from "./routes/vet";
import bookingsRoutes from "./routes/bookings";
import medicationsRoutes from "./routes/medications";
import invoiceRoutes from "./routes/invoice";
import usersAppRoutes from "./routes/usersApp";
import medicalRoutes from "./routes/medic";
import scheduleRoutes from "./routes/schedule";
import Stripe from "stripe";
import "dotenv/config";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Initialize Stripe and Cloudinary
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// Initialize Express and create HTTP server
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Socket.IO server is running.');
});
// Handle OPTIONS requests
app.options('*', cors());
// Socket.IO logic
// Set up WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  socket.on('newBooking', (booking) => {
  console.log('Received new booking:', booking);
  })
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/my-vet", myVetRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/breed", breedRoutes);
app.use("/api/breedType", breedTypeRoutes);
app.use("/api/vet", vetRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/bookings', bookingsRoutes(io));
app.use('/api/medications', medicationsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/usersApp', usersAppRoutes);
app.use('/api/medic', medicalRoutes);
app.use('/api/schedule', scheduleRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
