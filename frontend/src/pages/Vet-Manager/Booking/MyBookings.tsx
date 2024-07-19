import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faAtlas } from "@fortawesome/free-solid-svg-icons";
import { FaSearch } from "react-icons/fa"; // Import biểu tượng kính lúp
import BookingsForVet from "./BookingsForVet";

const Mybooking: React.FC = () => {
  const { userId } = useAppContext();

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filtered vet data based on search query
  const filteredVets = useMemo(() => {
    if (!vetData) return [];
    return vetData.filter(vet =>
      vet.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [vetData, searchQuery]);

  if (isVetLoading) {
    return <span>Loading...</span>;
  }

  if (vetError) {
    return <span>Error loading vet information</span>;
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-5">


      {/* Display filtered vet data */}
      {filteredVets.map((vet) => (
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
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center mt-4"
          >
            <FontAwesomeIcon icon={faAtlas} className="mr-2" /> Manage Booking
          </Link>
          
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
