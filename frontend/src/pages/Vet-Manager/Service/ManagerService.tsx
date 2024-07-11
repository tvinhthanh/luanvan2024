import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType } from "../../../../../backend/src/shared/types"; // Assuming VetCType is imported from shared types
import { Link } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import ServicesList from "./ServicesList"; // Import ServicesList component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons"; // Import the FontAwesome icon you want to use

const MyVetSer: React.FC = () => {
  const { userId,id_vet } = useAppContext();

  const {
    data: vetData,
    isLoading: isVetLoading,
    error: vetError,
  } = useQuery<VetCType[]>(
    ["fetchMyVet", userId],
    () => apiClient.fetchMyVets(userId),
    {
      onError: (err) => {
        console.error("Error fetching vet information:", err);
      },
    }
  );

  if (isVetLoading) {
    return <span>Loading...</span>;
  }

  if (vetError) {
    return <span>Error loading vet information</span>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Vet's Service</h1>
        {vetData && vetData.length > 0 && (
          <Link
            to={`/add-service`} // Assuming vetData[0]._id is used to add service for the first vet
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Service
          </Link>
        )}
      </div>
      {vetData && vetData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {vetData.map((vet: VetCType) => (
            <div key={id_vet} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{vet.name}</h2>
              {/* Pass vetId to ServicesList component */}
              <ServicesList vetId={id_vet} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-xl text-gray-600">No Vets found</p>
          <Link to="/add-vet" className="text-blue-500 hover:underline">
            Add Vet
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyVetSer;
