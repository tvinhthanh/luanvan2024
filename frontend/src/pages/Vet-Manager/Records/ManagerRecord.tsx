import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../../api-client";
import { PetType, OwnerType, MedicType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import MyVetInfo from "../Vet/VetInfo";
import { FaSearch } from "react-icons/fa";

const ManagerRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [aggregatedRecords, setAggregatedRecords] = useState<{ petName: string; ownerName: string; petId: string; ownerId: string; count: number }[]>([]);
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});
  const [loadingNames, setLoadingNames] = useState(true);

  const { data: records = [], isLoading, error } = useQuery<MedicType[]>(
    "fetchRecordForVet",
    () => apiClient.fetchMedicalRecordsByVetId(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching records:", err);
      },
      onSuccess: (data) => {
        aggregateRecords(data);
      }
    }
  );

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

  useEffect(() => {
    aggregateRecords(records);
  }, [records, searchQuery, namesMap, id_vet]);

  const aggregateRecords = (records: MedicType[]) => {
    if (records.length > 0) {
      const petMap: { [key: string]: { petName: string; ownerName: string; petId: string; ownerId: string; count: number } } = {};

      records.forEach(record => {
        const petName = namesMap[record.petId] || `Pet ${record.petId}`;
        const ownerName = namesMap[record.ownerId] || `Owner ${record.ownerId}`;
        if (!petMap[record.petId]) {
          petMap[record.petId] = { petName, ownerName, petId: record.petId, ownerId: record.ownerId, count: 0 };
        }
        if (record.vetId === id_vet) {
          petMap[record.petId].count += 1;
        }
      });

      const results = Object.values(petMap).filter(pet =>
        pet.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setAggregatedRecords(results);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading || loadingNames) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading records</div>;
  }

  const handleDelete = (recordId: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  const handleAdd = () => {
    navigate(`/add-medical`);
  };

  return (
    <div className="container mx-auto p-4">
      <MyVetInfo />
      <div className="my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Quản lý Phiếu khám</h1>
          <Link to="/add-medical">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Thêm Phiếu khám
            </button>
          </Link>
        </div>
        <div className="relative max-w-md mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by owner or pet name"
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <FaSearch className="absolute top-2 left-2 text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300">Tên thú cưng</th>
                <th className="py-2 px-4 border-b border-gray-300">Tên chủ nhân</th>
                <th className="py-2 px-4 border-b border-gray-300">Số lần đi khám</th>
                <th className="py-2 px-4 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {aggregatedRecords.map((record, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-300">{record.petName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{record.ownerName}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{record.count}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      className="text-blue-500 hover:underline mr-4"
                      onClick={() =>
                        navigate(`/details-record`, {
                          state: {
                            petId: record.petId,
                            ownerId: record.ownerId,
                          },
                        })
                      }
                    >
                      Chi tiết
                    </button>
                    <button
                      className="text-red-500 hover:underline mr-4"
                      onClick={() => handleDelete(record.petId)} // Assuming petId is used for deletion
                    >
                      Xoá
                    </button>
                    <button
                      className="text-green-500 hover:underline"
                      onClick={handleAdd}
                    >
                      Thêm phiếu khám
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerRecord;
