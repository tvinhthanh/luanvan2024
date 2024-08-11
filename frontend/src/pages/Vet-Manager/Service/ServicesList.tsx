import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { ServiceType } from "../../../../../backend/src/shared/types"; // Assuming ServiceType is imported from shared types
import { useAppContext } from "../../../contexts/AppContext";

interface ServicesListProps {
  vetId: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ vetId }) => {
  const navigate = useNavigate();
  const {id_vet} = useAppContext();
  const {
    data: services,
    isLoading,
    error,
  } = useQuery<ServiceType[]>(
    ["fetchServicesForVet", vetId],
    () => apiClient.fetchServicesForVet(vetId),
    {
      onError: (err) => {
        console.error(`Error fetching services for vet ${vetId}:`, err);
      },
    }
  );

  const queryClient = useQueryClient();

  const deleteServiceMutation = useMutation(apiClient.deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchServicesForVet", vetId]);
    },
    onError: (error: Error) => {
      console.error("Error deleting service:", error);
    },
  });

  const handleDelete = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteServiceMutation.mutateAsync(serviceId);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleUpdate = (service: ServiceType) => {
    navigate(`/edit-service/${service._id}`, { state: { service } });
  };

  if (isLoading) {
    return <span>Loading services...</span>;
  }

  if (error) {
    return <span>Error loading services</span>;
  }

  return (
    <>
      {services && services.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">
                Tên
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">
                Giá
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">
                Thời gian
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">
                Trạng thái
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td className="px-4 py-2 border-b">{service.name}</td>
                <td className="px-4 py-2 border-b">{service.price}$</td>
                <td className="px-4 py-2 border-b">{service.duration}</td>
                <td className="px-4 py-2 border-b">
                  {service.available ? "Available" : "Not Available"}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleUpdate(service)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No services found for this vet</p>
      )}
    </>
  );
};

export default ServicesList;
