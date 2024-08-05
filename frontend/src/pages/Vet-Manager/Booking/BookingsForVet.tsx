import React, { useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { BookingType, OwnerType, PetType } from "../../../../../backend/src/shared/types"; // Make sure PetType is imported
import { Link } from "react-router-dom";

interface Props {
  vetId: string;
}

const BookingsForVet: React.FC<Props> = ({ vetId }) => {
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

  // Function to filter bookings by status
  const filteredBookings = filterStatus
    ? bookings.filter((booking) => booking.status === filterStatus)
    : bookings;

  // Separate bookings with status 0 or 4
  const bookingsToShowLast = filteredBookings.filter(
    (booking) => booking.status === 0 || booking.status === 4
  );

  const bookingsToSort = filteredBookings.filter(
    (booking) => booking.status !== 0 && booking.status !== 4
  );

  // Sort remaining bookings by status and date
  const sortedBookings = [...bookingsToSort].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status - b.status; // Sort by status ascending
    }
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort by date descending
  });

  // Combine sorted bookings with bookings to show last
  const finalBookings = [...sortedBookings, ...bookingsToShowLast];

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return <span className="text-yellow-500">Đang chờ</span>;
      case 2:
        return <span className="text-green-500">Đã xác nhận</span>;
      case 3:
        return <span className="text-gray-500">Hoàn thành</span>;
      default:
        return <span className="text-red-500">Huỷ</span>;
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return "bg-yellow-100";
      case 2:
        return "bg-green-100";
      case 3:
        return "bg-gray-100";
      default:
        return "bg-red-100";
    }
  };

  return (
    <div className="space-y-3">
      {/* Combobox for status filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status:
        </label>
        <select
          value={filterStatus || ""}
          onChange={(e) => setFilterStatus(Number(e.target.value) || null)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All</option>
          <option value="0">Cancel</option>
          <option value="1">Pending</option>
          <option value="2">Confirmed</option>
          <option value="3">Completed</option>
          <option value="4">Custom Status</option>
        </select>
      </div>

      {finalBookings.map((booking) => {
        const owner = owners.find((owner) => owner._id === booking.ownerId);
        const isCompleted = booking.status === 3; // Check if booking status is Completed
        const statusColor = getStatusColor(booking.status);

        // Find the pet by petId
        const pet = pets.find((pet) => pet._id === booking.petId);

        return (
          <div key={booking._id} className={`border border-gray-200 p-4 rounded-lg shadow-md ${statusColor}`}>
            {/* Use conditional rendering for Link */}
            {isCompleted ? (
              <div>
                <h3 className="text-lg font-bold">Booking for {pet ? pet.name : `Owner's Phone: ${owner?.phone}`}</h3>
                <p>
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Status:</strong> {getStatusText(booking.status)}
                </p>
                {owner && (
                  <p>
                    <strong>Owner:</strong> {owner.name}
                  </p>
                )}
                <p>
                  <strong>Phone:</strong> {owner ? owner.phone : booking.phoneOwner}
                </p>
                <p>
                <strong>Time Update:</strong> {new Date(booking.updatedAt).toLocaleDateString()} - {new Date(booking.updatedAt).toLocaleTimeString()}
                  </p>
              </div>
            ) : (
              <Link to={`/bookings/${booking._id}`} className="text-black-500">
                <h3 className="text-lg font-bold">Booking for {pet ? pet.name : `Owner's Phone: ${owner?.phone}`}</h3>
                <p>
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Status:</strong> {getStatusText(booking.status)}
                </p>
                {owner && (
                  <p>
                    <strong>Owner:</strong> {owner.name}
                  </p>
                )}
                <p>
                  <strong>Phone:</strong> {owner ? owner.phone : booking.phoneOwner}
                </p>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingsForVet;
