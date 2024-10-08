import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType } from "../../../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import ServicesList from "./ServicesList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MyVetSer: React.FC = () => {
  const { userId } = useAppContext();

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
        <h1 className="text-2xl font-bold">Dịch vụ của phòng khám</h1>
        {vetData && vetData.length > 0 && (
          <Link
            to={`/add-service`}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Thêm Dịch vụ
          </Link>
        )}
      </div>
      {vetData && vetData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {vetData.map((vet: VetCType) => (
            <div key={vet._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{vet.name}</h2>
              <ServicesList vetId={vet._id} key={vet._id} /> {/* Ensure unique key */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-xl text-gray-600">No Vets found</p>
          <Link to="/add-vet" className="text-blue-500 hover:underline">
            Thêm Phòng khám
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyVetSer;
