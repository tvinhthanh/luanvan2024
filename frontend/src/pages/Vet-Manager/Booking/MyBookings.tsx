import React, { useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faAppleWhole, faAtlas, faPlus } from "@fortawesome/free-solid-svg-icons";
import BookingsForVet from "./BookingsForVet";

const Mybooking: React.FC = () => {
  const { userId } = useAppContext();


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
        <div
          key={vet._id}
          className="border border-gray-200 p-4 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold">{vet.name}</h2>
          <p className="text-gray-600">{vet.description}</p>
          <p className="mt-2">
            <strong>Location:</strong> {vet.address}
          </p>
          <p>
            <strong>Contact:</strong> {vet.phone}
          </p>

          {/* Link to add a new booking */}
          <Link
            to={`/add-booking?vetId=${vet._id}`} // Pass vetId as a query parameter
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center mt-4"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add Booking
          </Link>
          <Link
            to={`/manager-booking?vetId=${vet._id}`} // Pass vetId as a query parameter
            className="bg-green-500 text-white p-2 rounded hover:bg-red-600 flex items-center mt-4"
          >
            <FontAwesomeIcon icon={faAtlas} className="mr-2" /> Manager Booking
          </Link>
          {/* Display bookings related to each vet */}
          <h2 className="flex items-center justify-between text-2xl font-bold mt-5">
            Bookings
          </h2>
          <div className="space-y-5">
            <BookingsForVet key={vet._id} vetId={vet._id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mybooking;
