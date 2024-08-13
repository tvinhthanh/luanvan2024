import React, { useState } from 'react';
import socket from '../../../socket';

const BookingForm = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    socket.emit('newBooking', message);
    socket.emit('newVet',message);
    setMessage(''); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default BookingForm;
