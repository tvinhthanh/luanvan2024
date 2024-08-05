import React, { useState } from 'react';
import * as apiClient from '../../../api-client'; // Import your API client functions
import { useAppContext } from '../../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const AddVet: React.FC = () => {
  const { userId } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrls, setImg] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!imageUrls) {
      alert('Please select an image file.');
      return;
    }

    try {
      await apiClient.addMyVet(name, phone, address, imageUrls, description, userId);
      alert('Vet added successfully!');
      navigate(`/my-vet`); // Redirect to invoice page after creation
    } catch (error) {
      console.error('Error adding vet:', error);
      alert('Failed to add vet');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImg(event.target.files[0]);
    } else {
      setImg(null);
    }
  };



  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Vet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-semibold">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-semibold">
            Address:
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="text-sm font-semibold">
            Description:
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="phone" className="text-sm font-semibold">
            Phone:
          </label>
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="img" className="text-sm font-semibold">
            Image:
          </label>
          <input
            id="imageUrls"
            type="file"
            name="imageFiles" // Ensure this name matches what your server expects
            onChange={handleFileChange}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Add Vet
        </button>
      </form>
    </div>
  );
};

export default AddVet;
