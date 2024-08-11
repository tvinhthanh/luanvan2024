import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { VetCType } from "../../../../backend/src/shared/types";
import VetDetails from "../../../src/components/detail/vetDetail"; // Adjust path as needed

const ManagerVet: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedVet, setSelectedVet] = useState<VetCType | null>(null);

  // Fetching the list of vets
  const { data: vets, error, isLoading } = useQuery<VetCType[], Error>(
    "fetchVets",
    apiClient.fetchVet
  );

  // Mutation for deleting a vet
  const deleteVetMutation = useMutation(apiClient.deleteVet, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchVets");
    },
  });

  // Mutation for updating a vet
  const updateVetMutation = useMutation(apiClient.updateVetType, {
    onSuccess: () => {
      // Invalidate and refetch the vets after successful update
      queryClient.invalidateQueries("fetchVets");
    },
  });

  // Handling vet delete
  const handleDelete = (vetId: string) => {
    if (window.confirm("Are you sure you want to delete this vet?")) {
      deleteVetMutation.mutate(vetId);
    }
  };
  // Handling vet update
  const handleUpdate = (vet: VetCType) => {
    const updatedVet = { ...vet, type: !vet.type };
    updateVetMutation.mutate(updatedVet);
  };

  // Display loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div>Error loading vets: {error.message}</div>;
  }

  // Display the list of vets
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý phòng khám</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa Chỉ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vets?.map((vet: VetCType) => (
            <tr
              key={vet._id}
              onClick={() => setSelectedVet(vet)}
              className="cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">{vet.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vet.address}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {vet.lastUpdated
                  ? new Date(vet.lastUpdated).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vet.type ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {vet.type ? "ON" : "OFF"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(vet);
                  }}
                  className="inline-flex items-center px-2 py-1 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                >
                  Update
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(vet._id);
                  }}
                  className="inline-flex items-center px-2 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render VetDetails component if a vet is selected */}
      {selectedVet && (
        <VetDetails vet={selectedVet} onClose={() => setSelectedVet(null)} />
      )}
    </div>
  );
};

export default ManagerVet;
