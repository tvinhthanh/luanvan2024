import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { BookingType, OwnerType, PetType } from "../../../../../backend/src/shared/types";
import { Link } from "react-router-dom";

interface Props {
  vetId: string;
}

const ManagerBooking: React.FC<Props> = ({ vetId }) => {
  const [filterStatus, setFilterStatus] = useState<number | null>(null); // State for filtering by status
  const [filterDate, setFilterDate] = useState<string | null>(null); // State for filtering by date
  const queryClient = useQueryClient();

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

  // Mutation for deleting a booking
  const mutation = useMutation({
    mutationFn: (bookingId: string) => apiClient.deleteBooking(bookingId),
    onSuccess: () => {
      // Invalidate and refetch the bookings query
      queryClient.invalidateQueries(["fetchBookingsForVet", vetId]);
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });

  const handleDelete = (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      mutation.mutate(bookingId);
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return <span className="text-yellow-500">Đang chờ xác nhận</span>;
      case 0:
        return <span className="text-red-500">Từ chối</span>;
      case 2:
        return <span className="text-green-500">Đã xác nhận</span>;
      case 3:
        return <span className="text-gray-500">Hoàn thành</span>;
      default:
        return <span className="text-red-500">Unknown</span>;
    }
  };

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
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filterStatus ? booking.status === filterStatus : true;
    const matchesDate = filterDate
      ? new Date(booking.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
      : true;

    return matchesStatus && matchesDate;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Sort in descending order
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manager Bookings</h1>
      
      {/* Filter UI */}
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={filterStatus ?? ""}
          onChange={(e) => setFilterStatus(parseInt(e.target.value))}
          className="mr-4 border border-gray-300 rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="1">Đang chờ xác nhận</option>
          {/* <option value="0">Từ chối</option> */}
          <option value="2">Đã xác nhận</option>
          <option value="3">Hoàn thành</option>
        </select>

        <label className="mr-2">Filter by Date:</label>
        <input
          type="date"
          value={filterDate ?? ""}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded p-2"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Thời gian</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Cập nhật lúc</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Trạng thái</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Số điện thoại</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Thú cưng</th>
            <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Chức năng</th>
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
                <td className="px-4 py-2 border-b">{new Date(booking.date).toLocaleDateString()} : {new Date(booking.date).toLocaleTimeString()}</td>
                <td className="px-4 py-2 border-b">{new Date(booking.updatedAt).toLocaleDateString()} : {new Date(booking.updatedAt).toLocaleTimeString()}</td>
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
                  <p
                    className="text-red-500 hover:underline cursor-pointer"
                    onClick={() => handleDelete(booking._id)}
                  >
                    Delete
                  </p>
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
