import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { Breed, BreedType } from '../../../../backend/src/shared/types';

const ManagerBreed: React.FC = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breedTypes, setBreedTypes] = useState<BreedType[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBreeds();
    fetchBreedTypes();
  }, []);

  const fetchBreeds = async () => {
    try {
      const breedData: Breed[] = await apiClient.fetchBreeds();
      setBreeds(breedData);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const fetchBreedTypes = async () => {
    try {
      const breedTypesData: BreedType[] = await apiClient.fetchBreedType();
      setBreedTypes(breedTypesData);
    } catch (error) {
      console.error('Error fetching breed types:', error);
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const getBreedTypeName = (id_type: string | undefined): string => {
    const breedType = breedTypes.find(type => type._id === id_type);
    return breedType ? breedType.name : '';
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản Lý Loại Giống</h1>
        <Link
          to="/pet"
          className="py-2 px-4 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
        >
          Quay lại Trang Chính
        </Link>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm giống..."
          value={filterText}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-md p-2 mr-2"
        />
        <button
          onClick={() => navigate('/breed-form')}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          + Thêm Giống
        </button>
      </div>
      <ul>
        {filteredBreeds.map((breed) => (
          <li key={breed._id} className="py-2 px-4 border-b border-gray-300 flex justify-between items-center">
            <div className="flex items-center">
              {breed.img && <img src={breed.img} alt={breed.name} className="w-16 h-16 object-cover mr-4" />}
              <span>{breed.name}</span>
            </div>
            <div>
              <span className="mr-2">{getBreedTypeName(breed.id_type)}</span>
              <button
                onClick={() => navigate(`/breed-form/${breed._id}`)}
                className="mr-2 py-1 px-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600"
              >
                Sửa
              </button>
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
