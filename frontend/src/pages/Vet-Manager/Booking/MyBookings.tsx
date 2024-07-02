import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType, BookingType, OwnerType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MyVetInfo: React.FC = () => {
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

  // Assuming you want to render bookings related to this vet
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

      {/* Display bookings related to each vet */}
      <h2 className="flex items-center justify-between text-2xl font-bold mt-5 ">Bookings</h2>
      <Link
          to={`/add-bookings`} // Assuming vetData[0]._id is used to add service for the first vet
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
        </Link>
      <div className="space-y-5">
        {vetData?.map((vet) => (
          <BookingsForVet key={vet._id} vetId={vet._id} />
        ))}
      </div>
      
    </div>
  );
};

// Component to fetch and display bookings for a specific vet
const BookingsForVet: React.FC<{ vetId: string }> = ({ vetId }) => {
  const { data: bookings, isLoading, error } = useQuery<BookingType[]>(
    ["fetchBookingsForVet", vetId],
    () => apiClient.fetchBookings(vetId),
    {
      onError: (err) => {
        console.error("Error fetching bookings:", err);
      },
    }
  );

  // Function to convert status code to status text
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Confirmed";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Query to fetch owner information
  const { data: owners = [] } = useQuery<OwnerType[]>(
    "fetchOwners",
    () => apiClient.fetchOwner(),
    {
      // Adjust this query based on your API or data fetching needs
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  if (isLoading) {
    return <span>Loading bookings...</span>;
  }

  if (error) {
    return <span>Error loading bookings</span>;
  }

  if (!bookings || bookings.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        // Find the owner associated with this booking
        const owner = owners.find((owner) => owner._id === booking.ownerId);
        return (
          <div
            key={booking._id}
            className="border border-gray-200 p-4 rounded-lg shadow-md"
          >
            {/* Link to Edit-bookings with booking id as parameter */}
            <Link to={`/Edit-bookings/${booking._id}`} className="text-blue-500 hover:underline">
              <h3 className="text-lg font-bold">Booking for {booking.petId}</h3>
            </Link>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {getStatusText(booking.status)}
            </p>
            {owner && (
              <p>
                <strong>Owner:</strong> {owner.name}
              </p>
            )}
            <p>
              <strong>Phone:</strong> {owner?.phone}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MyVetInfo;
