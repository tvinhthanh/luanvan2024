// MedicationNames.tsx
import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicationType } from "../../../../../backend/src/shared/types";

const MedicationNames: React.FC<{ medicationIds: string[] }> = ({ medicationIds }) => {
  const { data: medications = [], error, isLoading } = useQuery(
    ["fetchMedications", medicationIds],
    () => apiClient.fetchMedicationsByIds(medicationIds),
    {
      enabled: medicationIds.length > 0, // Chỉ thực hiện truy vấn nếu có ID
    }
  );

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error fetching medications</span>;

  return (
    <div>
      {medications.length > 0 ? (
        medications.map((medication: MedicationType) => (
          <div key={medication._id}>
            <h3>{medication.name}</h3>
          </div>
        ))
      ) : (
        <span>No medications found</span>
      )}
    </div>
  );
};

export default MedicationNames;
