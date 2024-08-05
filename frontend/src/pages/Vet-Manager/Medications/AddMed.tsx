import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { MedicationType } from "../../../../../backend/src/shared/types";
import Toast from "../../../components/Toast";

const AddMed: React.FC = () => {
  const { id_vet } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"SUCCESS" | "ERROR">("SUCCESS");

  const instructionOptions = [
    "200ml 2 times per day",
    "300ml 3 times per day, one time 100ml",
    "200ml 1 time per day",
    "400ml 2 times per day, one time 200ml",
  ];

  const { data: existingMedications = [], isLoading, error } = useQuery<MedicationType[]>(
    ["fetchMedicationsForVet", id_vet],
    () => apiClient.fetchMedicationsForVet(id_vet),
    {
      onError: (err) => {
        console.error(`Error fetching medications for vet ${id_vet}:`, err);
      },
    }
  );

  const addMedicationMutation = useMutation(
    () => apiClient.addMedications(name, price, dosage, instructions, id_vet, quantity),
    {
      onSuccess: () => {
        setToastMessage("Medication added successfully!");
        setToastType("SUCCESS");
        setName("");
        setPrice(0);
        setQuantity(0);
        setDosage("");
        setInstructions("");
        navigate('/my-vet/med'); // Redirect to /my-vet/medication after success
      },
      onError: (error: Error) => {
        setToastMessage("Error adding medication: " + error.message);
        setToastType("ERROR");
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMedicationMutation.mutate();
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error loading medications</span>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Medication</h1>
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
            <option value="" disabled>Select dosage</option>
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
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Số lượng
          </label>
          <input
            type="number"
            id="quantity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm Thuốc
          </button>
        </div>
      </form>
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

export default AddMed;