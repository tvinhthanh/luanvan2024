import React, { useEffect, useState } from 'react';
import socket from '../../../socket'; // Đảm bảo rằng đường dẫn tới file socket.js là chính xác

const BookingNotification = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Lắng nghe sự kiện 'bookingNotification' từ server
    socket.on("bookingNotification", (booking) => {
      setNotifications(prev => [...prev, `New booking added: ${booking._id}`]);
    });

    // Cleanup khi component bị unmount
    return () => {
      socket.off("bookingNotification");
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookingNotification;
