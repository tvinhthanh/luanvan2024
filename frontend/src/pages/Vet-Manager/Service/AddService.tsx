import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import * as apiClient from "../../../api-client";
import { ServiceType } from "../../../../../backend/src/shared/types";
import Toast from "../../../components/Toast"; // Import your custom Toast component

const AddService: React.FC = () => {
  const { id_vet } = useAppContext(); // Get id_vet from the context
  const navigate = useNavigate(); // Initialize navigate from useNavigate

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<string>("30 minutes");
  const [available, setAvailable] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"SUCCESS" | "ERROR">("SUCCESS");

  // Query hook for fetching existing services for the vet
  const { } = useQuery<ServiceType[]>(
    ["fetchServicesForVet", id_vet],
    () => apiClient.fetchServicesForVet(id_vet),
    {
      onError: (err) => {
        console.error(`Error fetching services for vet ${id_vet}:`, err);
      },
    }
  );

  // Mutation hook for adding a new service
  const addServiceMutation = useMutation(
    () => apiClient.addService(name, price, duration, available, id_vet),
    {
      onSuccess: () => {
        setToastMessage("Service added successfully!");
        setToastType("SUCCESS");
        // Reset form fields after successful addition
        setName("");
        setPrice("");
        setDuration("30 minutes");
        setAvailable(true);
        navigate('/my-vet/service'); // Redirect to /my-vet/service after success
      },
      onError: (error: Error) => {
        setToastMessage("Error adding service: " + error.message);
        setToastType("ERROR");
      },
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addServiceMutation.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Service</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Service Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Price
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
        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700 font-bold mb-2">
            Duration
          </label>
          <select
            id="duration"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          >
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1 hour 30 minutes">1 hour 30 minutes</option>
            <option value="2 hours">2 hours</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="available" className="block text-gray-700 font-bold mb-2">
            Available
          </label>
          <select
            id="available"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={available ? "true" : "false"}
            onChange={(e) => setAvailable(e.target.value === "true")}
            required
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Service
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

export default AddService;
