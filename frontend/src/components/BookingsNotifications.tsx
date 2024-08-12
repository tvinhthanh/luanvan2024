// src/components/BookingNotification.tsx
import React, { useEffect, useState } from 'react';
import socket from '../socket'; // Đảm bảo rằng bạn đang import đúng
import Toast from './Toast'; // Đảm bảo rằng bạn đang import đúng Toast component

const BookingNotification: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "SUCCESS" | "ERROR" } | null>(null);

  useEffect(() => {
    socket.on('newBooking', (booking: any) => {
      if (booking) {
        // Hiển thị thông báo dạng toast với thông tin chi tiết hơn và xuống dòng
        setToast({
          message: `New booking added!\nPhone: ${booking.phoneOwner || 'Unknown'}\nVào khung giờ: ${new Date(booking.date).toLocaleString()}`,
          type: "SUCCESS",
        });
      } else {
        setToast({
          message: 'Received an invalid booking',
          type: "ERROR",
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('newBooking');
    };
  }, []);

  // Handle close of the toast
  const handleClose = () => {
    setToast(null);
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default BookingNotification;
