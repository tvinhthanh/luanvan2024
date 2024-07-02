// EditVet.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as apiClient from '../../../api-client';
import { VetCType } from '../../../../../backend/src/shared/types';
import { toast } from 'react-toastify';

const EditVet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the state passed via the Link component
  const { vet } = location.state as { vet: VetCType };

  const [name, setName] = useState(vet.name);
  const [address, setAddress] = useState(vet.address);
  const [phone, setPhone] = useState(vet.phone);
  const [imageUrls, setImageUrls] = useState<string[]>(vet.imageUrls);
  const [error, setError] = useState<string | null>(null);
console.log(vet)
const handleUpdate = async (event: React.FormEvent) => {
  event.preventDefault();

  try {
    await apiClient.updateVet(vet._id, { name, address, phone, imageUrls });
    toast.success('Vet updated successfully!');
    navigate('/my-vet-info');
  } catch (err) {
    setError('Error updating vet information');
    toast.error('Error updating vet information');
  }
};

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold">Update Vet</h1>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
      <input
          type="text"
          placeholder="Id"
          value={vet._id}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
          disabled
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={imageUrls.join(',')}
          onChange={(e) => setImageUrls(e.target.value.split(',').map(url => url.trim()))}
          className="border border-gray-300 rounded-md p-2"
        />
        {/* <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        /> */}
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Update Vet
        </button>
      </form>
    </div>
  );
};

export default EditVet;