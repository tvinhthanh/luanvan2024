import React, { useState } from 'react';
import socket from '../../../socket';

const BookingForm = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit('newBooking', message);
    setMessage(''); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter booking message"
      />
      <button type="submit">Send Booking</button>
    </form>
  );
};

export default BookingForm;
