import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicationType } from "../../../../../backend/src/shared/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";

const ManageMedications: React.FC = () => {
  const { id_vet } = useAppContext();
  const queryClient = useQueryClient();

  // Fetch medications query
  const { data: medications = [], isLoading, error } = useQuery<MedicationType[]>(
    ["fetchMedicationsForVet", id_vet],
    () => apiClient.fetchMedicationsForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching medications:", err);
      },
    }
  );

  // Mutation for deleting medication
  const deleteMedicationMutation = useMutation(apiClient.deleteMedication, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchMedicationsForVet", id_vet]); // Invalidate cache to trigger refetch
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Thuốc</h1>
        <Link to="/add-med" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm Thuốc
        </Link>
      </div>

      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>Error loading medications</span>
      ) : medications.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Tên</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Liều lượng</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Hướng dẫn sử dụng</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Giá</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Số lượng</th>
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
                <td className="px-4 py-2 border-b">{medication.quantity}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    to= {`/edit-med/${medication._id}`}
                    state= { {medication} }
                    className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </Link>
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
