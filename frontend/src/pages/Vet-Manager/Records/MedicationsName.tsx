import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";

const MedicationName: React.FC<{ medicationIds: string[] }> = ({ medicationIds }) => {
  // Define an array to hold the fetched medication data
  const [medications, setMedications] = React.useState<any[]>([]);
  
  // Fetch medications data for all IDs
  const { isLoading, error } = useQuery(
    ["fetchMedications", medicationIds],
    () => Promise.all(medicationIds.map(id => apiClient.fetchMedicationsById(id))),
    {
      enabled: medicationIds.length > 0,
      onSuccess: (data) => {
        setMedications(data);
      }
    }
  );

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error fetching medication names</span>;

  // Split the medications into alternating lines
  const medicationLines = medications.reduce<string[][]>((acc, medication, index) => {
    if (index % 2 === 0) {
      acc.push([medication.name || "Unknown Medication"]);
    } else {
      acc[acc.length - 1].push(medication.name || "Unknown Medication");
    }
    return acc;
  }, []);

  return (
    <div>
      {medicationLines.map((line, index) => (
        <div key={index}>
          {line.join(" / ")}
        </div>
      ))}
    </div>
  );
};

export default MedicationName;
