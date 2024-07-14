import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { RecordType, PetType, OwnerType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import MyVetInfo from "../Vet/VetInfo";

const DetailRecords: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vetId = queryParams.get("vetId") || "";
  const petId = queryParams.get("petId") || "";
  const medicId = queryParams.get("medicId") || "";
  const ownerId = queryParams.get("ownerId") || "";
  const recordId = queryParams.get("recordId") || "";

  const { data: record, isLoading, error } = useQuery<RecordType>(
    "fetchRecordDetails",
    () => apiClient.fetchRecordById(recordId),
    {
      enabled: !!recordId, // Ensure recordId is present before fetching
      onError: (err) => {
        console.error("Error fetching record details:", err);
      },
    }
  );

  // State to store pet and owner names
  const [petName, setPetName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");

  // Fetch pet and owner names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const petResponse = await apiClient.fetchPetbyId(petId);
        const ownerResponse = await apiClient.fetchOwnerById(ownerId);

        setPetName(petResponse.name);
        setOwnerName(ownerResponse.name);
      } catch (error) {
        console.error("Error fetching pet or owner details:", error);
      }
    };

    fetchNames();
  }, [petId, ownerId]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error loading record details</span>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6">
      <h1 className="text-3xl font-bold mb-4">Patient Record</h1>

      {/* Grid container for the first row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">{petName}</h2>
        </div>

        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
        <MyVetInfo/>
        </div>
      </div>

      {/* Grid container for the second row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Column 1 */}
        <div className="bg-white shadow-md rounded-lg p-6 col-span-1 mb-6">
          <MyVetInfo/>
        </div>

        {/* Column 2 */}
        <div className="bg-white shadow-md rounded-lg p-6 col-span-3 mb-6">
          <h2 className="text-2xl font-semibold mb-2">Center</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Header 1</th>
                <th className="py-2 px-4">Header 2</th>
                <th className="py-2 px-4">Header 1</th>
                <th className="py-2 px-4">Header 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4">Data 1</td>
                <td className="py-2 px-4">Data 2</td>
                <td className="py-2 px-4">Data 1</td>
                <td className="py-2 px-4">Data 2</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Data 3</td>
                <td className="py-2 px-4">Data 4</td>
                <td className="py-2 px-4">Data 1</td>
                <td className="py-2 px-4">Data 2</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Data 3</td>
                <td className="py-2 px-4">Data 4</td>
              </tr>
              <tr>
                <td className="py-2 px-4">Data 3</td>
                <td className="py-2 px-4">Data 4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailRecords;
