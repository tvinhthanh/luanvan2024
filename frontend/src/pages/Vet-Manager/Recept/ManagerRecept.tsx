import React, { useEffect, useState } from "react";
import { BookingType } from "../../../../../backend/src/shared/types";

type ManagerReceiptProps = {
  userId: string; // Assuming userId is passed as a prop
};

const ManagerReceipt: React.FC<ManagerReceiptProps> = ({ userId }) => {
  const [receipts, setReceipts] = useState<BookingType[]>([]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch("/api/my-bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Example: Fetch token from localStorage
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReceipts(data);
        } else {
          console.error("Failed to fetch receipts");
        }
      } catch (error) {
        console.error("Error fetching receipts:", error);
        // Handle error fetching data
      }
    };

    fetchReceipts();
  }, [userId]); // Fetch receipts whenever userId changes

  return (
    <div>
      <h2>Manager Receipts</h2>
      <ul>
        {receipts.map((receipt) => (
          <li key={receipt._id}>
            <p>User: {receipt.ownerId}</p>
            <p>Date: {receipt.date.toLocaleDateString()}</p>
            {/* Add more details from receipt as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerReceipt;
