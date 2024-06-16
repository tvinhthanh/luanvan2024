import UserDetail from "../../components/detail/userDetail"; // Import UserDetail component
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";

const ManagerUser = () => {
  const queryClient = useQueryClient();
  const { data: users, error, isLoading } = useQuery("fetchUsers", apiClient.fetchUsers);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const createUserMutation = useMutation(apiClient.createUser, {
    onSuccess: () => queryClient.invalidateQueries("fetchUsers"),
  });

  const updateUserMutation = useMutation(
    (data: { userId: string; formData: FormData }) => apiClient.updateUser(data.userId, data.formData),
    {
      onSuccess: () => queryClient.invalidateQueries("fetchUsers"),
    }
  );

  const deleteUserMutation = useMutation(apiClient.deleteUser, {
    onSuccess: () => queryClient.invalidateQueries("fetchUsers"),
  });

  const [showDetail, setShowDetail] = useState(false); // State to control the display of UserDetail
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);

    if (isEditing && currentUserId) {
      updateUserMutation.mutate({ userId: currentUserId, formData: form });
    } else {
      createUserMutation.mutate(form);
    }

    setFormData({ name: "", email: "" });
    setIsEditing(false);
    setCurrentUserId(null);
  };

  const handleEdit = (user: any) => {
    setIsEditing(true);
    setCurrentUserId(user._id);
    setFormData({ name: user.name, email: user.email });
  };

  const handleDelete = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const handleShowDetail = (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedUser(null);
  };

  const handleRowClick = (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Admin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user: any) => (
            <tr key={user._id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleRowClick(user)}>
              <td className="px-6 py-4 whitespace-nowrap">{user.firstName} {user.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.isAdmin ? 'Admin' : 'Host'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                  className="inline-flex items-center px-2 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying user details */}
      {showDetail && (
        <UserDetail user={selectedUser} onClose={handleCloseDetail} />
      )}
    </div>
    
  );
  
};


export default ManagerUser;
