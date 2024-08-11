import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { OwnerType, BookingType, PetType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const AddBooking: React.FC = () => {
  const { id_vet } = useAppContext();
  const [petId, setPetId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [phoneOwner, setPhoneOwner] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState(1);
  const [pets, setPets] = useState<PetType[]>([]);
  const [ownerOptions, setOwnerOptions] = useState<OwnerType[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all owners
  const { data: owners = [], isLoading: isOwnersLoading, error: ownersError } = useQuery<OwnerType[]>(
    "fetchOwners",
    apiClient.fetchOwner,
    {
      onSuccess: (data) => setOwnerOptions(data),
      onError: (err) => console.error("Error fetching owners:", err),
    }
  );

  // Fetch pets when owner email or ownerId changes
  useEffect(() => {
    const fetchPets = async () => {
      if (ownerEmail) {
        try {
          const fetchedPets = await apiClient.fetchPetByOwnerId(ownerEmail);
          setPets(fetchedPets);
        } catch (error) {
          console.error("Error fetching pets:", error);
        }
      } else {
        setPets([]);
      }
    };

    fetchPets();
  }, [ownerEmail]);

  // Handle submission
  const addBookingMutation = useMutation(apiClient.addBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchBookingsForVet", id_vet]);
      navigate(`/my-booking`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${date}T${time}`);
      const newBooking: Partial<BookingType> = {
        _id: '',
        petId,
        ownerId,
        date: dateTime,
        phoneOwner,
        status,
        vetId: id_vet,
      };
      await addBookingMutation.mutateAsync(newBooking as BookingType);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  // Handle owner change
  const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOwner = owners.find((owner) => owner._id === e.target.value);
    setOwnerId(e.target.value);
    setOwnerEmail(selectedOwner?.email || "");
    setPhoneOwner(selectedOwner?.phone || "");
  };

  // Handle phone input change
  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setPhoneOwner(phone);
    try {
      const matchedOwner = ownerOptions.find((owner) => owner.phone === phone);
      if (matchedOwner) {
        setOwnerId(matchedOwner._id);
        setOwnerEmail(matchedOwner.email);
        const fetchedPets = await apiClient.fetchPetByOwnerId(matchedOwner.email);
        setPets(fetchedPets);
      } else {
        setOwnerId("");
        setOwnerEmail("");
        setPets([]);
      }
    } catch (error) {
      console.error("Error fetching owner by phone:", error);
    }
  };

  if (isOwnersLoading) return <span>Loading owners...</span>;
  if (ownersError) return <span>Error loading owners</span>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Booking</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <select
            value={ownerId}
            onChange={handleOwnerChange}
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
            onChange={handlePhoneChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value={2}>Confirmed</option> 
            <option value={4}>Completed</option>
          </select>
        </div> */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Thêm Lịch hẹn
        </button>
      </form>
      {petId && (
        <Link
          to={`/add-medical`}
          state={{ ownerId, petId }}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block"
        >
          Tạo phiếu khám
        </Link>
      )}
    </div>
  );
};

export default AddBooking;
