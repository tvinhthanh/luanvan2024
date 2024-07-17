import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useQueries } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicType, MedicationType, PetType, OwnerType } from "../../../../../backend/src/shared/types";

const MedicalRecordDetail: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: medicalRecord,
    isLoading: isRecordLoading,
    error: recordError,
  } = useQuery<MedicType>(
    ["fetchMedicalRecordById", recordId],
    () => apiClient.fetchMedicalRecordById(recordId || ""),
    {
      enabled: !!recordId,
      onError: (err) => {
        console.error("Error fetching medical record:", err);
      },
    }
  );

  const {
    data: pet,
    isLoading: isPetLoading,
    error: petError,
  } = useQuery<PetType>(
    ["fetchPetById", medicalRecord?.petId || ""],
    () => apiClient.fetchPetById(medicalRecord?.petId || ""),
    {
      enabled: !!medicalRecord?.petId,
      onError: (err) => {
        console.error("Error fetching pet information:", err);
      },
    }
  );

  const {
    data: owner,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useQuery<OwnerType>(
    ["fetchOwnerById", medicalRecord?.ownerId || ""],
    () => apiClient.fetchOwnerById(medicalRecord?.ownerId || ""),
    {
      enabled: !!medicalRecord?.ownerId,
      onError: (err) => {
        console.error("Error fetching owner information:", err);
      },
    }
  );

  const deleteMedicalRecordMutation = useMutation(
    (recordId: string) => apiClient.deleteMedicalRecord(recordId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchMedicalRecordById", recordId]);
        navigate("/medical-record"); // Redirect to medical records page after deletion
      },
      onError: (error: Error) => {
        console.error("Error deleting medical record:", error);
      },
    }
  );

  const medicationQueries = useQueries(
    (medicalRecord?.medications || []).map((medicationId) => ({
      queryKey: ["fetchMedication", medicationId],
      queryFn: () => apiClient.fetchMedicationsById(medicationId),
      enabled: !!medicalRecord,
      onError: (error: any) => {
        console.error("Error fetching medication:", error);
      },
    }))
  );

  const medications: MedicationType[] = medicationQueries
    .flatMap((query) => query.data || [])
    .filter((data): data is MedicationType => data !== undefined);

  const handleDelete = async () => {
    if (!medicalRecord || !recordId) return;

    try {
      await deleteMedicalRecordMutation.mutateAsync(recordId);
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  };

  const handleCreateInvoice = async () => {
    if (!medicalRecord || !recordId || !owner || !pet) return;
  
    try {
      // Ensure medications are an array of strings
      const medications = medicalRecord.medications.map((medId) => medId.toString());
  
      navigate(`/create-invoice`, { state: { medicalRecord: { ...medicalRecord, medications }, pet, ownerId: owner._id } });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  if (isRecordLoading || isPetLoading || isOwnerLoading) {
    return <span>Loading...</span>;
  }

  if (recordError || !medicalRecord) {
    return <span>Error: Medical record not found</span>;
  }

  if (petError || !pet) {
    return <span>Error: Pet information not found</span>;
  }

  if (ownerError || !owner) {
    return <span>Error: Owner information not found</span>;
  }

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">
        Medical Record of {pet.name}
      </h3>
      <p>
        <strong>Visit Date:</strong>{" "}
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
      <p>
        <strong>Record ID:</strong> {medicalRecord._id}
      </p>
      <div className="mt-4">
        <h4 className="font-bold">Medications:</h4>
        <ul>
          {medications.map((medication) => (
            <li key={medication._id}>
              <p>
                <strong>Name:</strong> {medication.name}
              </p>
              <p>
                <strong>Dosage:</strong> {medication.dosage}
              </p>
              <p>
                <strong>Instructions:</strong> {medication.instructions}
              </p>
              <p>
                <strong>Price:</strong> ${parseFloat(medication.price.toString()).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Delete Medical Record
      </button>
      <button
        onClick={handleCreateInvoice}
        className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 ml-2"
      >
        Create Invoice
      </button>
    </div>
  );
};

export default MedicalRecordDetail;
