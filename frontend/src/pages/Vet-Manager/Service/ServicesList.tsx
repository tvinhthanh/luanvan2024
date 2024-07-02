import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { ServiceType } from "../../../../../backend/src/shared/types"; // Assuming ServiceType is imported from shared types

interface ServicesListProps {
  vetId: string;
}

const ServicesList: React.FC<ServicesListProps> = ({ vetId }) => {
  const { data: services, isLoading, error } = useQuery<ServiceType[]>(["fetchServicesForVet", vetId], () => apiClient.fetchServicesForVet(vetId), {
    onError: (err) => {
      console.error(`Error fetching services for vet ${vetId}:`, err);
    },
  });

  const queryClient = useQueryClient();

  // Mutation to delete a service
  const deleteServiceMutation = useMutation(apiClient.deleteService, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchServicesForVet", vetId]); // Invalidate cache to trigger refetch
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
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Price</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Duration</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Availability</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td className="px-4 py-2 border-b">{service.name}</td>
                <td className="px-4 py-2 border-b">{service.price}$</td>
                <td className="px-4 py-2 border-b">{service.duration}</td>
                <td className="px-4 py-2 border-b">{service.available ? "Available" : "Not Available"}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)} // Call handleDelete with service._id
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
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
