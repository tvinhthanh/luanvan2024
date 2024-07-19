import React, { useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { BookingType, OwnerType, PetType } from "../../../../../backend/src/shared/types"; // Make sure PetType is imported
import { Link } from "react-router-dom";

interface Props {
  vetId: string;
}

const ManagerBooking: React.FC<Props> = ({ vetId }) => {
  const [filterStatus, setFilterStatus] = useState<number | null>(null); // State for filtering by status

  const { data: bookings, isLoading, error } = useQuery<BookingType[]>(
    ["fetchBookingsForVet", vetId],
    () => apiClient.fetchBookings(vetId),
    {
      onError: (err) => {
        console.error("Error fetching bookings:", err);
      },
    }
  );

  const { data: owners = [] } = useQuery<OwnerType[]>(
    "fetchOwners",
    () => apiClient.fetchOwner(),
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  const { data: pets = [] } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(), // Adjust to your API call for fetching pets
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  if (isLoading) {
    return <span>Loading bookings...</span>;
  }

  if (error) {
    return <span>Error loading bookings</span>;
  }

  if (!bookings || bookings.length === 0) {
    return <span>No bookings found</span>;
  }

  // Function to filter and sort bookings by status and date
  const filteredBookings = filterStatus
    ? bookings.filter((booking) => booking.status === filterStatus)
    : bookings;

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-500">Đang chờ xác nhận</span>;
      case 1:
        return <span className="text-red-500">Từ chối</span>;
      case 2:
        return <span className="text-green-500">Đã xác nhận</span>;
      case 3:
        return <span className="text-gray-500">Hoàn thành</span>;
      default:
        return <span className="text-red-500">Unknown</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manager Bookings</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Date</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Time</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Status</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Phone</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Pet</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedBookings.map((booking) => {
            const owner = owners.find((owner) => owner._id === booking.ownerId);
            const isCompleted = booking.status === 1 || booking.status === 2 || booking.status === 0; // Check if booking status is Completed

            // Find the pet by petId
            const pet = pets.find((pet) => pet._id === booking.petId);

            return (
              <tr key={booking._id}>
                <td className="px-4 py-2 border-b">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{new Date(booking.date).toLocaleTimeString()}</td>
                <td className="px-4 py-2 border-b">{getStatusText(booking.status)}</td>
                <td className="px-4 py-2 border-b">{owner ? owner.phone : booking.phoneOwner}</td>
                <td className="px-4 py-2 border-b">{pet ? pet.name : "Pet not found"}</td>
                <td className="px-4 py-2 border-b">
                  {isCompleted ? (
                    <Link to={`/bookings/${booking._id}`} className="text-blue-500 hover:underline">
                      View
                    </Link>
                  ) : (
                    <span className="text-gray-500">Done</span>
                  )}
                  <p className="text-red-500 hover:underline"> Delete</p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerBooking;
