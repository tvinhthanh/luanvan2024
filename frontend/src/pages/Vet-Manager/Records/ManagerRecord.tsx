import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { RecordType, PetType, OwnerType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import MyVetInfo from "../Vet/VetInfo";
import { FaSearch } from "react-icons/fa"; // Import biểu tượng kính lúp

const ManagerRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for search query and filtered records
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState<RecordType[]>([]);
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});
  const [loadingNames, setLoadingNames] = useState(true);

  // Fetching records for the current vet using react-query
  const { data: records = [], isLoading, error } = useQuery<RecordType[]>(
    "fetchRecordForVet",
    () => apiClient.fetchRecordForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching records:", err);
      },
      onSuccess: (data) => {
        // Set initial filtered records based on search query
        setFilteredRecords(data);
      }
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

  // Function to fetch and update namesMap
  useEffect(() => {
    const fetchNames = async () => {
      try {
        setLoadingNames(true);
        const [petsResponse, ownersResponse] = await Promise.all([
          apiClient.fetchpet(),
          apiClient.fetchOwner()
        ]);

        const petNames = petsResponse.reduce((acc: { [key: string]: string }, pet: PetType) => {
          acc[pet._id] = pet.name;
          return acc;
        }, {});
        const ownerNames = ownersResponse.reduce((acc: { [key: string]: string }, owner: OwnerType) => {
          acc[owner._id] = owner.name;
          return acc;
        }, {});

        setNamesMap({ ...petNames, ...ownerNames });
      } catch (error) {
        console.error("Error fetching names:", error);
      } finally {
        setLoadingNames(false);
      }
    };

    fetchNames();
  }, []);

  // Update filtered records when records or searchQuery change
  useEffect(() => {
    if (records.length > 0) {
      const results = records.filter(record => {
        const petName = namesMap[record.petId] || `Pet ${record.petId}`;
        const ownerName = namesMap[record.ownerId] || `Owner ${record.ownerId}`;
        return petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredRecords(results);
    }
  }, [records, searchQuery, namesMap]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading || loadingNames) {
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
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by owner or pet name"
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-2 left-2 text-gray-500" />
        </div>
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
            {filteredRecords.map((record) => (
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
