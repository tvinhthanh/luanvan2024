import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { RecordType, PetType, OwnerType } from "../../../../../backend/src/shared/types";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import MyVetInfo from "../Vet/VetInfo";

const ManagerRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const { data: records = [], isLoading, error } = useQuery<RecordType[]>(
    "fetchRecordForVet",
    () => apiClient.fetchRecordForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching records:", err);
      },
    }
  );

  // State to store pet, owner, and vet names mapped by their IDs
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});

  // Function to fetch and update namesMap
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch pets, owners
        const petsResponse = await apiClient.fetchpet();
        const ownersResponse = await apiClient.fetchOwner();

        // Map IDs to names
        const petNames = petsResponse.reduce((acc: { [key: string]: string }, pet: PetType) => {
          acc[pet._id] = pet.name;
          return acc;
        }, {});
        const ownerNames = ownersResponse.reduce((acc: { [key: string]: string }, owner: OwnerType) => {
          acc[owner._id] = owner.name;
          return acc;
        }, {});

        // Merge all mappings into one namesMap
        setNamesMap({ ...petNames, ...ownerNames });
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, []);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error loading records</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <MyVetInfo />
      <br/>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manager Records</h1>
        <Link to="/add-record">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Record
          </button>
        </Link>
      </div>
      <div className="mt-4">
        <table className="min-w-full bg-white border-collapse overflow-hidden border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
            <th className="py-2 px-4 border-b border-gray-300">ID</th>
              <th className="py-2 px-4 border-b border-gray-300">Pet Name</th>
              <th className="py-2 px-4 border-b border-gray-300">Owner Name</th>
              <th className="py-2 px-4 border-b border-gray-300">Medical Records</th>
              <th className="py-2 px-4 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {records.map((record) => (
              <tr key={record._id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  {namesMap[record._id] || `${record._id}`}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {namesMap[record.petId] || `Pet ${record.petId}`}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {namesMap[record.ownerId] || `Owner ${record.ownerId}`}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {record.medicId?.length}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <Link to={`/details-record`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerRecord;
