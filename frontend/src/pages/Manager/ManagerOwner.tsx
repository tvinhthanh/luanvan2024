import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import OwnerDetails from '../../components/detail/ownerDetail';

const ManagerOwner = () => {
  const queryClient = useQueryClient();
  const { data: owners, error, isLoading } = useQuery("fetchOwners", apiClient.fetchOwner);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const deleteOwnerMutation = useMutation(apiClient.deleteOwner, {
    onSuccess: () => queryClient.invalidateQueries("fetchOwners"),
  });

  const handleDelete = (ownerId: string) => {
    deleteOwnerMutation.mutate(ownerId);
  };

  const handleRowClick = (owner: any) => {
    setSelectedOwner(owner);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading owners</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {owners.map((owner: any) => (
                <tr key={owner._id} onClick={() => handleRowClick(owner)} className="cursor-pointer hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{owner.name}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{owner.phone}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">{owner.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(owner._id);
                      }}
                      className="inline-flex items-center px-2 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedOwner && (
          <OwnerDetails owner={selectedOwner} onClose={() => setSelectedOwner(null)} />
        )}
      </div>
    );
  };
  
  export default ManagerOwner;
  