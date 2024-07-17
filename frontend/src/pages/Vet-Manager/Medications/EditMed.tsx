import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { MedicationType } from "../../../../../backend/src/shared/types";
import Toast from "../../../components/Toast";
import { useAppContext } from "../../../contexts/AppContext";

const EditMed: React.FC = () => {
  const navigate = useNavigate();
  const {id_vet} = useAppContext();
  const { medicationId } = useParams<{ medicationId?: string }>(); // Define medicationId as optional

  const [name, setName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"SUCCESS" | "ERROR">("SUCCESS");

  const instructionOptions = [
    "200ml 2 times per day",
    "300ml 3 times per day, one time 100ml",
    "200ml 1 time per day",
    "400ml 2 times per day, one time 200ml",
  ];

  // Use useQuery to fetch medication data for editing
  const { data: medication, isLoading, error } = useQuery<MedicationType>(
    ["fetchMedication", medicationId],
    () => apiClient.fetchMedicationsById(medicationId), // Ensure medicationId is defined before making the API call
    {
      onSuccess: (data) => {
        setName(data.name);
        setDosage(data.dosage);
        setInstructions(data.instructions);
        setPrice(data.price.toString());
      },
      onError: (err) => {
        console.error(`Error fetching medication ${medicationId}:`, err);
      },
      enabled: !!medicationId, // Only fetch if medicationId is defined
    }
  );

  // Use useMutation to handle medication update
  const editMedicationMutation = useMutation(
    (updatedMedication: MedicationType) =>
      apiClient.updateMedication(updatedMedication),
    {
      onSuccess: () => {
        setToastMessage("Medication updated successfully!");
        setToastType("SUCCESS");
        navigate("/my-vet/medication");
      },
      onError: (error: Error) => {
        setToastMessage("Error updating medication: " + error.message);
        setToastType("ERROR");
      },
    }
  );

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedMedication: MedicationType = {
      _id: medicationId || "", // Ensure medicationId is defined before using it
      name,
      dosage,
      instructions,
      price,
      vetId: id_vet,
    };
    editMedicationMutation.mutate(updatedMedication);
  };

  // Show loading message while fetching data
  if (isLoading) {
    return <span>Loading...</span>;
  }

  // Show error message if fetching data fails
  if (error) {
    return <span>Error loading medication</span>;
  }

  // Render edit medication form
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Medication</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Tên thuốc
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter medication name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dosage" className="block text-gray-700 font-bold mb-2">
            Liều lượng
          </label>
          <select
            id="dosage"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          >
            {instructionOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="instructions" className="block text-gray-700 font-bold mb-2">
            Hướng dẫn sử dụng
          </label>
          <input
            type="text"
            id="instructions"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Giá
          </label>
          <input
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Lưu lại
          </button>
        </div>
      </form>
      {/* Display success or error message */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default EditMed;
