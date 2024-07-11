import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicType, OwnerType, PetType } from "../../../../../backend/src/shared/types";

const MedicalRecordDetail: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>(); // Ensure recordId is defined as a string

  // Query to fetch the medical record by ID
  const {
    data: medicalRecord,
    isLoading: isRecordLoading,
    error: recordError,
  } = useQuery<MedicType>(
    ["fetchMedicalRecordById", recordId],
    () => apiClient.fetchMedicalRecordById(recordId || ''), // Handle undefined case with fallback
    {
      onError: (err) => {
        console.error("Error fetching medical record:", err);
      },
    }
  );
  
  // Query to fetch owners
  const {
    data: owners = [],
    isLoading: isOwnersLoading,
    error: ownersError,
  } = useQuery<OwnerType[]>(
    "fetchOwners",
    () => apiClient.fetchOwner(),
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  // Query to fetch pets
  const {
    data: pets = [],
    isLoading: isPetsLoading,
    error: petsError,
  } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(),
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  // Loading state check
  if (isRecordLoading || isOwnersLoading || isPetsLoading) {
    return <span>Loading...</span>;
  }

  // Error state check
  if (recordError || ownersError || petsError) {
    return <span>Error loading data</span>;
  }

  // Check if medical record is not found
  if (!medicalRecord) {
    return <span>Medical record not found</span>;
  }

  // Find owner and pet information based on IDs in medical record
  const owner = owners.find((owner) => owner._id === medicalRecord.ownerId);
  const pet = pets.find((pet) => pet._id === medicalRecord.petId);

  // Render medical record details
  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">
        Medical Record for {pet ? pet.name : "Unknown Pet"}
      </h3>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(medicalRecord.visitDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Reason for Visit:</strong> {medicalRecord.reasonForVisit}
      </p>
      <p>
        <strong>Symptoms:</strong> {medicalRecord.symptoms}
      </p>
      <p>
        <strong>Diagnosis:</strong> {medicalRecord.diagnosis}
      </p>
      <p>
        <strong>Treatment Plan:</strong> {medicalRecord.treatmentPlan}
      </p>
      {medicalRecord.notes && (
        <p>
          <strong>Notes:</strong> {medicalRecord.notes}
        </p>
      )}
      {owner && (
        <p>
          <strong>Owner:</strong> {owner.name}
        </p>
      )}
      {medicalRecord.medications && medicalRecord.medications.length > 0 && (
        <div>
          <h4 className="font-bold">Medications:</h4>
          <ul>
            {medicalRecord.medications.map((medication, index) => (
              <li key={index}>
                <p>
                  <strong>Name:</strong> {medication.name}
                </p>
                <p>
                  <strong>Dosage:</strong> {medication.dosage}
                </p>
                <p>
                  <strong>Instructions:</strong> {medication.instructions}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordDetail;
