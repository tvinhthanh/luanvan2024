import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import {
  BookingType,
  PetType,
  OwnerType,
} from "../../../../../backend/src/shared/types";

const DetailBooking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>(); // Lấy bookingId từ params của URL
  const queryClient = useQueryClient(); // Use the useQueryClient hook
  const navigate = useNavigate(); // Hook to navigate

  // State cho trạng thái booking
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );

  // Query để fetch chi tiết booking
  const {
    data: booking,
    isLoading,
    error,
  } = useQuery<BookingType>(
    ["fetchBooking", bookingId],
    () => apiClient.fetchBookingById(bookingId || ""),
    {
      onError: (err) => {
        console.error("Error fetching booking detail:", err);
      },
    }
  );

  // Query để fetch danh sách pets
  const { data: pets = [] } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(), // Thay đổi thành API call để lấy danh sách pets
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  // Query để fetch owner thông tin
  const {
    data: owner,
    isLoading: ownerLoading,
    error: ownerError,
  } = useQuery<OwnerType | undefined>(
    ["fetchOwner", booking?.ownerId],
    () =>
      booking?.ownerId
        ? apiClient.fetchOwnerById(booking.ownerId)
        : Promise.resolve(undefined),
    {
      enabled: !!booking?.ownerId, // Chỉ fetch khi ownerId có giá trị
      onError: (err) => {
        console.error("Error fetching owner details:", err);
      },
    }
  );

  // Mutation để cập nhật trạng thái
  const updateBookingStatus = useMutation(
    (newStatus: number) => apiClient.updateBookingStatus(bookingId!, newStatus),
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

  // Xử lý khi người dùng thay đổi trạng thái
  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(parseInt(e.target.value));
  };

  // Xử lý khi người dùng submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedStatus !== undefined) {
      updateBookingStatus.mutate(selectedStatus);
    }
  };

  if (isLoading || ownerLoading) {
    return <span>Đang tải...</span>;
  }

  if (error || ownerError) {
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
          {/* Hiển thị tên của pet */}
          {pets.length > 0 && (
            <h2 className="text-xl font-bold">
              {pets.find((pet) => pet._id === booking.petId)?.name}
            </h2>
          )}
          <p className="text-gray-600">
            Chủ nhân: {owner ? owner.name : "Không tìm thấy"}
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
          {/* Dropdown để chọn trạng thái mới */}
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
          {/* Nút chuyển sang trang AddMedic.tsx */}
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
