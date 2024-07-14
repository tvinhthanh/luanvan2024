import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicType } from "../../../../../backend/src/shared/types";

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
    () => apiClient.fetchMedicalRecordById(recordId || ''),
    {
      enabled: !!recordId,
      onError: (err) => {
        console.error("Error fetching medical record:", err);
      },
    }
  );

  const deleteMedicalRecordMutation = useMutation(
    (recordId: string) => apiClient.deleteMedicalRecord(recordId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchMedicalRecordById", recordId]);
        navigate("/medical-records"); // Redirect to medical records page after deletion
      },
      onError: (error: Error) => {
        console.error("Error deleting medical record:", error);
      },
    }
  );

  const handleDelete = async () => {
    if (!medicalRecord || !recordId) return;

    try {
      await deleteMedicalRecordMutation.mutateAsync(recordId);
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  };

  if (isRecordLoading) {
    return <span>Loading...</span>;
  }

  if (recordError || !medicalRecord) {
    return <span>Error: Medical record not found</span>;
  }

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">
        Medical Record of {medicalRecord.petId}
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
        <strong>Record ID:</strong> {medicalRecord.recordId}
      </p>
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
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Delete Medical Record
      </button>
    </div>
  );
};

export default MedicalRecordDetail;
