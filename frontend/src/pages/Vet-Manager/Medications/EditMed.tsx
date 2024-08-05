import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as apiClient from '../../../api-client';
import { MedicationType } from '../../../../../backend/src/shared/types';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../contexts/AppContext';

const EditMed: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_vet } = useAppContext();

  // Get the state passed via the Link component
  const { medication } = location.state as { medication: MedicationType };

  // Initialize state variables with medication data
  const [name, setName] = useState(medication.name);
  const [dosage, setDosage] = useState(medication.dosage);
  const [instructions, setInstructions] = useState(medication.instructions);
  const [price, setPrice] = useState<number>(medication.price); // Price as number
  const [quantity, setQuantity] = useState<number>(medication.price); // Price as number
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Call API to update medication information
      const updatedMedication: MedicationType = {
        _id: medication._id,
        name,
        dosage,
        instructions,
        price, // Price as number
        vetId: id_vet,
        quantity,
      };
      await apiClient.updateMedication(updatedMedication);
      // Show success toast and navigate back
      toast.success('Medication updated successfully!');
      navigate('/my-vet/med');
    } catch (err) {
      // Handle error
      setError('Error updating medication');
      toast.error('Error updating medication');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold">Edit Medication</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))} // Convert string to number
          className="border border-gray-300 rounded-md p-2"
        />
         <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))} // Convert string to number
          className="border border-gray-300 rounded-md p-2"
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Update Medication
        </button>
      </form>
    </div>
  );
};

export default EditMed;
