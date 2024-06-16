import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { VetType } from "../../../../backend/src/shared/types";
import VetDetails from "../../../src/components/detail/vetDetail"; // Import VetDetails component

const ManagerVet: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedVet, setSelectedVet] = useState<VetType | null>(null);

  // Fetching the list of vets
  const { data: vets, error, isLoading } = useQuery<VetType[], Error>("fetchVets", apiClient.fetchVet);

  // Mutation for deleting a vet
  const deleteVetMutation = useMutation(apiClient.deleteVet, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchVets");
    },
  });

  // Handling vet delete
  const handleDelete = (vetId: string) => {
    deleteVetMutation.mutate(vetId);
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
      <h1 className="text-2xl font-bold mb-4">Vet Management</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vets?.map((vet: VetType) => (
            <tr key={vet._id} onClick={() => setSelectedVet(vet)}>
              <td className="px-6 py-4 whitespace-nowrap">{vet.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vet.service}</td>
              <td className="px-6 py-4 whitespace-nowrap">
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
