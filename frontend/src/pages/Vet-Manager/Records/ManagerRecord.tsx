import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { RecordType, PetType, OwnerType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import MyVetInfo from "../Vet/VetInfo";

const ManagerRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetching records for the current vet using react-query
  const { data: records = [], isLoading, error } = useQuery<RecordType[]>(
    "fetchRecordForVet",
    () => apiClient.fetchRecordForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching records:", err);
      },
    }
  );

  // Mutation to delete a record
  const deleteRecordMutation = useMutation(
    (recordId: string) => apiClient.deleteRecordById(recordId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchRecordForVet");
      },
      onError: (err) => {
        console.error("Error deleting record:", err);
      },
    }
  );

  // State to store pet, owner, and vet names mapped by their IDs
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});

  // Function to fetch and update namesMap
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch pets and owners
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

  // Handle delete button click
  const handleDelete = (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <MyVetInfo />
      <br />
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
                <td className="py-2 px-4 border-b border-gray-300">{record._id}</td>
                <td className="py-2 px-4 border-b border-gray-300">{namesMap[record.petId] || `Pet ${record.petId}`}</td>
                <td className="py-2 px-4 border-b border-gray-300">{namesMap[record.ownerId] || `Owner ${record.ownerId}`}</td>
                <td className="py-2 px-4 border-b border-gray-300">{record.medicId?.length || 0}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() =>
                      navigate(`/details-record`, {
                        state: {
                          recordId: record._id,
                          petId: record.petId || `Pet ${record.petId}`,
                          ownerId: record.ownerId || `Owner ${record.ownerId}`,
                        },
                      })
                    }
                  >
                    View Details
                  </button>
                  <button
                    className="text-red-500 hover:underline ml-4"
                    onClick={() => handleDelete(record._id)}
                  >
                    Delete
                  </button>
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
