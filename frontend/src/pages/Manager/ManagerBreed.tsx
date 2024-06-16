import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { Breed } from '../../../../backend/src/shared/types';

interface FormDataState {
  name: string;
  img: string;
}

const ManagerBreed: React.FC = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [formDataState, setFormDataState] = useState<FormDataState>({ name: '', img: '' });
  const [mode, setMode] = useState<'add' | 'update' | 'view'>('view');
  const [selectedBreedId, setSelectedBreedId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const breedTypes: Breed[] = await apiClient.fetchBreeds();
      setBreeds(breedTypes);
    } catch (error) {
      console.error('Error fetching breed names:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', formDataState.name);
      formData.append('imageUrl', formDataState.img);

      if (mode === 'add') {
        await apiClient.addBreed(formData);
      } else if (mode === 'update' && selectedBreedId) {
        await apiClient.updateBreed(selectedBreedId, formData);
        setMode('view');
        setSelectedBreedId(null);
      }

      fetchBreeds();
      setFormDataState({ name: '', img: '' });
    } catch (error) {
      console.error('Error adding/updating breed:', error);
    }
  };

  const handleDelete = async (breedId: string) => {
    try {
      await apiClient.deleteBreed(breedId);
      fetchBreeds();
    } catch (error) {
      console.error('Error deleting breed:', error);
    }
  };

  const handleUpdate = (breedId: string, breedName: string, breedImg: string) => {
    setMode('update');
    setSelectedBreedId(breedId);
    setFormDataState({ name: breedName, img: breedImg });
  };

  const handleViewDetails = (breedId: string) => {
    setMode('view');
    setSelectedBreedId(breedId);
    // Fetch breed details and setFormDataState based on the breedId if needed
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  // Filter breeds based on filterText
  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản Lý Loại Giống</h1>
        <Link
          to="/"
          className="py-2 px-4 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
        >
          Quay lại Trang Chính
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm giống..."
          value={filterText}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        {mode === 'add' && (
          <>
            <input
              type="text"
              placeholder="Tên giống"
              value={formDataState.name}
              onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
              className="border border-gray-300 rounded-md p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Link ảnh"
              value={formDataState.img}
              onChange={(e) => setFormDataState({ ...formDataState, img: e.target.value })}
              className="border border-gray-300 rounded-md p-2 mr-2"
            />
          </>
        )}
        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          {mode === 'add' ? 'Thêm Giống' : 'Cập nhật Giống'}
        </button>
      </form>
      <ul>
        {filteredBreeds.map((breed) => (
          <li key={breed._id} className="py-2 px-4 border-b border-gray-300 flex justify-between items-center">
            <span>{breed.name}</span>
            <div>
              {selectedBreedId === breed._id ? (
                <>
                  <img src={breed.img} alt={breed.name} className="w-20 h-20 object-cover full" />
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleViewDetails(breed._id)}
                    className="mr-2 py-1 px-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleUpdate(breed._id, breed.name, breed.img)}
                    className="mr-2 py-1 px-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600"
                  >
                    Sửa
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(breed._id)}
                className="py-1 px-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 focus:outline-none focus:bg-red-600"
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerBreed;
