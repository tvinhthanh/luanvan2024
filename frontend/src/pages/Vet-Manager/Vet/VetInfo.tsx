import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType} from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";


const MyVetInfo: React.FC = () => {
  const { userId, id_vet } = useAppContext();

  // Query to fetch vet information
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
    <div className="space-y-5">
      {vetData?.map((vet) => (
        <div key={vet._id} className="border border-gray-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{vet.name}</h2>
          <p className="text-gray-600">{vet.description}</p>
          <p className="mt-2">
            <strong>Location:</strong> {vet.address}
          </p>
          <p>
            <strong>Contact:</strong> {vet.phone}
          </p>
        </div>
      ))}
    </div>
  ); 
};

export default MyVetInfo;
