import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { BookingType, PetType, OwnerType, VetCType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const DetailBooking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>(); // Get bookingId from URL params
  const queryClient = useQueryClient(); // Use the useQueryClient hook
  const navigate = useNavigate(); // Hook to navigate
  const { id_vet } = useAppContext();

  // State for booking status
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(undefined);

  // Query to fetch vet information by id_vet
  const { data: vet, isLoading: vetLoading, error: vetError } = useQuery<VetCType | undefined>(
    ["fetchVet", id_vet],
    () => apiClient.fetchVetById(id_vet),
    {
      enabled: !!id_vet, // Only fetch when id_vet has a value
      onError: (err) => {
        console.error("Error fetching vet details:", err);
      },
    }
  );

  // Query to fetch booking details
  const { data: booking, isLoading: bookingLoading, error: bookingError } = useQuery<BookingType>(
    ["fetchBooking", bookingId],
    () => apiClient.fetchBookingById(bookingId || ""),
    {
      onError: (err) => {
        console.error("Error fetching booking detail:", err);
      },
    }
  );

  // Query to fetch list of pets
  const { data: pets = [], isLoading: petsLoading, error: petsError } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(), // API call to get list of pets
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  // Find the pet associated with the booking
  const pet = pets.find((pet) => pet._id === booking?.petId);

  // Query to fetch owner information based on pet's email
  const { data: owner, isLoading: ownerLoading, error: ownerError } = useQuery<OwnerType | undefined>(
    ["fetchOwnerByEmail", pet?.email],
    () =>
      pet?.email
        ? apiClient.fetchOwnerById(pet.email) // API call to get owner information based on pet's email
        : Promise.resolve(undefined),
    {
      enabled: !!pet?.email, // Only fetch when pet's email has a value
      onError: (err) => {
        console.error("Error fetching owner details by pet email:", err);
      },
    }
  );

  // Mutation to update booking status
  const updateBookingStatus = useMutation(
    (newStatus: number) => {
      if (vet && vet.name) {
        return apiClient.updateBookingStatus(bookingId!, newStatus, vet.name); // Send vet's name
      } else {
        return Promise.reject(new Error("Vet information or name is not available"));
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchBooking", bookingId]);
        navigate("/my-booking");
      },
      onError: (err) => {
        console.error("Error updating booking status:", err);
      },
    }
  );

  // Handle status change
  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(parseInt(e.target.value));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStatus !== undefined) {
      updateBookingStatus.mutate(selectedStatus);
    }
  };

  if (bookingLoading || petsLoading || ownerLoading || vetLoading) {
    return <span>Đang tải...</span>;
  }

  if (bookingError || petsError || ownerError || vetError) {
    return <span>Lỗi khi tải chi tiết booking</span>;
  }

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

  const petName = pet?.name || "Không tìm thấy";

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chi tiết Booking</h1>
        <Link to="/my-booking" className="text-blue-500 underline">
          Quay lại
        </Link>
      </div>
      {booking && (
        <div className="border border-gray-200 p-4 rounded-lg shadow-md">
          {/* Display pet's name */}
          <h2 className="text-xl font-bold">{petName}</h2>
          <p className="text-gray-600">
            Chủ nhân: {pet?.email || "Không tìm thấy"}
          </p>
          <p className="mt-2">
            <strong>Ngày:</strong> {new Date(booking.date).toLocaleDateString()}
            <strong> Giờ:</strong> {new Date(booking.date).toLocaleTimeString()}
          </p>
          <p>
            <strong>Trạng thái:</strong> {getStatusText(booking.status)}
          </p>
          <p>
            <strong>Số điện thoại chủ nhân:</strong>{" "}
            {booking.phoneOwner || "Không có số điện thoại"}
          </p>
          {/* Dropdown to select new status */}
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chuyển sang trạng thái:
            </label>
            <select
              value={selectedStatus ?? ""}
              onChange={handleChangeStatus}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Chọn trạng thái...</option>
              <option value="0">Huỷ</option>
              <option value="1">Đang chờ</option>
              <option value="2">Đã xác nhận</option>
              <option value="3">Hoàn thành</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              disabled={updateBookingStatus.isLoading}
            >
              Cập nhật
            </button>
          </form>
          {/* Button to navigate to AddMedical */}
          <Link
            to={`/add-medical/${bookingId}`} // Include bookingId in the route
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
          >
            Tạo bệnh án
          </Link>
        </div>
      )}
    </div>
  );
};

export default DetailBooking;
