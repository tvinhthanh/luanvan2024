import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { ServiceType } from "../../../../../backend/src/shared/types"; // Assuming ServiceType is imported from shared types
import { useAppContext } from "../../../contexts/AppContext";

const EditService: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {id_vet} = useAppContext();

  const service = location.state?.service as ServiceType;

  // Fallback if no service data is found in the state
  if (!service) {
    navigate("/my-vet-services");
    return null;
  }

  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [duration, setDuration] = useState(service.duration.toString()); // Handle duration as a string
  const [available, setAvailable] = useState(service.available.toString()); // Handle available as a combobox

  const updateServiceMutation = useMutation(apiClient.updateService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchServicesForVet", service.id_vet]); // Adjust the query key as necessary
      navigate(`/my-vet/service`); // Redirect to services page after update
    },
    onError: (error: Error) => {
      console.error("Error updating service:", error);
    },
  });

  const handleUpdate = async () => {
    const updatedService: ServiceType = {
      ...service,
      name,
      price,
      duration, // Convert duration back to number
      available: available === "true", // Convert available back to boolean
    };

    try {
      await updateServiceMutation.mutateAsync(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cập nhật Dịch vụ</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tên
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Giá
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Thời gian
        </label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Trạng thái
        </label>
        <select
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
      </div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Cập nhật Dịch vụ
      </button>
    </div>
  );
};

export default EditService;
