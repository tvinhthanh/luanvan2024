import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType, MedicType, OwnerType, PetType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import { Link } from "react-router-dom";
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

      {/* Display medical records related to each vet */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mt-5">Medical Record</h2>
        <Link
          to={`/add-bookings`} // Adjust this path as needed
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
        </Link>
      </div>
      <div className="space-y-5">
        {vetData?.map((vet) => (
          <MedicalOfVet key={vet._id} vetId={vet._id} />
        ))}
      </div>
    </div>
  );
};

const MedicalOfVet: React.FC<{ vetId: string }> = ({ vetId }) => {
  const { data: medicalRecords, isLoading, error } = useQuery<MedicType[]>(
    ["fetchMedicalRecordsByVetId", vetId],
    () => apiClient.fetchMedicalRecordsByVetId(vetId),
    {
      onError: (err) => {
        console.error("Error fetching medical records:", err);
      },
    }
  );

  const { data: owners = [] } = useQuery<OwnerType[]>(
    "fetchOwners",
    () => apiClient.fetchOwner(),
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  const { data: pets = [] } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(),
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  if (isLoading) {
    return <span>Loading medical records...</span>;
  }

  if (error) {
    return <span>Error loading medical records</span>;
  }

  if (!medicalRecords || medicalRecords.length === 0) {
    return <span>No medical records found</span>;
  }

  return (
    <div className="space-y-3">
      {medicalRecords.map((record) => {
        const owner = owners.find((owner) => owner._id === record.ownerId);
        const pet = pets.find((pet) => pet._id === record.petId);
        return (
          <div
            key={record._id}
            className="border border-gray-200 p-4 rounded-lg shadow-md"
          >
            <Link to={`/Edit-bookings/${record._id}`} className="text-blue-500 hover:underline">
              <h3 className="text-lg font-bold">Medical Record for {pet ? pet.name : "Unknown Pet"}</h3>
            </Link>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(record.visitDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Reason for Visit:</strong> {record.reasonForVisit}
            </p>
            <p>
              <strong>Symptoms:</strong> {record.symptoms}
            </p>
            <p>
              <strong>Diagnosis:</strong> {record.diagnosis}
            </p>
            <p>
              <strong>Treatment Plan:</strong> {record.treatmentPlan}
            </p>
            {record.notes && (
              <p>
                <strong>Notes:</strong> {record.notes}
              </p>
            )}
            {owner && (
              <p>
                <strong>Owner:</strong> {owner.name}
              </p>
            )}
            <p>
              {/* <strong>Phone:</strong> {record.phone} */}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MyVetInfo;
