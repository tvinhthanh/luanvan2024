import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicationType } from "../../../../../backend/src/shared/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ManageMedications: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch medications query
  const { data: medications = [], isLoading, error } = useQuery<MedicationType[]>(
    "fetchMedications",
    apiClient.fetchMedications,
    {
      onError: (err) => {
        console.error("Error fetching medications:", err);
      },
    }
  );

  // Mutation for deleting medication
  const deleteMedicationMutation = useMutation(apiClient.deleteMedication, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchMedications"); // Invalidate cache to trigger refetch
    },
    onError: (error: Error) => {
      console.error("Error deleting medication:", error);
    },
  });

  // Function to handle deletion
  const handleDelete = async (medicationId: string) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await deleteMedicationMutation.mutateAsync(medicationId);
      } catch (error) {
        console.error("Error deleting medication:", error);
      }
    }
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error loading medications</span>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Medications</h1>
        <Link to="/add-medication" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Medication
        </Link>
      </div>

      {medications.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Dosage</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Instructions</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Price</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication) => (
              <tr key={medication._id}>
                <td className="px-4 py-2 border-b">{medication.name}</td>
                <td className="px-4 py-2 border-b">{medication.dosage}</td>
                <td className="px-4 py-2 border-b">{medication.instructions}</td>
                <td className="px-4 py-2 border-b">{medication.price}$</td>
                <td className="px-4 py-2 border-b">
                  <button className="mr-2 px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                  <button
                    onClick={() => handleDelete(medication._id)}
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
        <p className="text-xl text-gray-600 mt-4">No medications found</p>
      )}
    </div>
  );
};

export default ManageMedications;
