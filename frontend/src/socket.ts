import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Ensure this is your server URL

const SOCKET_SERVER_URL = API_BASE_URL; // URL of your Socket.IO server

const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true,
  timeout: 5000,
});

socket.on("connect", () => {
  console.log("Connected to socket server");
});

// Listen for 'newBooking' event from server
socket.on("newBooking", (booking) => {
  console.log("Received new booking:", booking);

  // Perform actions with the received booking data
  // For example, you could update the state or UI here
});

// Optionally, listen for disconnection
socket.on("disconnect", (reason) => {
  console.log(`Disconnected from socket server: ${reason}`);
});
// Listen for 'newBooking' event from server
socket.on("newVet", (vet) => {
  console.log("Received new vet:", vet);

  // Perform actions with the received booking data
  // For example, you could update the state or UI here
});
// Optionally, handle connection errors
socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Emit a 'newBooking' event (if needed)
// Ensure this matches your server's expectations
socket.emit('newBooking', { message: "Test booking data" });
socket.emit('newVet', { message: "Test booking data" });


export default socket;
