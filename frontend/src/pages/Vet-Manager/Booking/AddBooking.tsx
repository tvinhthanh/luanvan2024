import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { OwnerType, BookingType, Pet } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const AddBooking: React.FC = () => {
  const { id_vet } = useAppContext();
  const [petId, setPetId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [phoneOwner, setPhoneOwner] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); // Add state for time
  const [status, setStatus] = useState(1); // Default status
  const [pets, setPets] = useState<Pet[]>([]); // State for pet selection
  const navigate = useNavigate(); // Navigate hook
  const queryClient = useQueryClient(); // Query client hook for invalidation

  // Fetch owners with react-query
  const { data: owners = [], isLoading: isOwnersLoading, error: ownersError } = useQuery<OwnerType[]>(
    "fetchOwners",
    apiClient.fetchOwner,
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  // Effect to fetch pets when ownerId changes
  useEffect(() => {
    const fetchPets = async () => {
      if (ownerId) {
        try {
          const fetchedPets = await apiClient.fetchPetByOwnerId(ownerId);
          setPets(fetchedPets);
        } catch (error) {
          console.error("Error fetching pets:", error);
        }
      } else {
        setPets([]);
      }
    };

    fetchPets();
  }, [ownerId]);

  // Mutation hook for adding a new booking
  const addBookingMutation = useMutation(apiClient.addBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchBookingsForVet", id_vet]); // Invalidate bookings query for this vet
      navigate(`/bookings`); // Navigate to bookings page after successful addition
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting with vetId:", id_vet); // Log to verify id_vet value
  
      // Create a new booking object with input data
      const dateTime = new Date(`${date}T${time}`); // Combine date and time into a Date object
      const newBooking: Partial<BookingType> = {
        _id: '',
        petId,
        ownerId,
        date: dateTime,
        phoneOwner,
        status,
        vetId: id_vet, // Assign the vetId obtained from context
      };
  
      // Perform mutation to add the new booking
      const addedBooking = await addBookingMutation.mutateAsync(newBooking as BookingType);
      console.log("Added Booking:", addedBooking);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  // Loading and error handling for owners query
  if (isOwnersLoading) {
    return <span>Loading owners...</span>;
  }

  if (ownersError) {
    return <span>Error loading owners</span>;
  }

  // Render the form once owners data is loaded
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <select
            value={ownerId}
            onChange={(e) => {
              const selectedOwner = owners.find((owner) => owner._id === e.target.value);
              setOwnerId(e.target.value);
              setPhoneOwner(selectedOwner?.phone || "");
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Owner</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Owner</label>
          <input
            type="text"
            value={phoneOwner}
            onChange={(e) => setPhoneOwner(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            readOnly={!!ownerId} // Make this readOnly when an owner is selected
            required={!ownerId} // Require input when no owner is selected
          />
        </div>
        {ownerId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Pet</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value={1}>Pending</option>
            <option value={2}>Confirmed</option>
            <option value={3}>Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Booking
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
