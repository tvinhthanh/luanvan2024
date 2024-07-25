import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as apiClient from '../api-client';
import { Breed, BreedType } from '../../../backend/src/shared/types';

interface FormDataState {
  name: string;
  img: File | null; // Thay đổi từ string sang File
  breedTypeId?: string;
}

const BreedForm: React.FC = () => {
  const { breedId } = useParams<{ breedId: string }>();
  const [formDataState, setFormDataState] = useState<FormDataState>({
    name: '',
    img: null,
    breedTypeId: undefined,
  });
  const [breedTypes, setBreedTypes] = useState<BreedType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBreedTypes(); // Fetch breed types when component mounts
    if (breedId) {
      fetchBreedById(breedId); // Fetch breed data if breedId is provided
    }
  }, [breedId]);

  const fetchBreedById = async (id: string) => {
    try {
      const breed: Breed = await apiClient.fetchBreedById(id);
      setFormDataState({
        name: breed.name,
        img: null, // Do not set image here
        breedTypeId: breed.id_type,
      });
    } catch (error) {
      console.error('Error fetching breed:', error);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { name, img, breedTypeId } = formDataState;

      if (!name || !breedTypeId) {
        console.error('Name and breedTypeId are required fields');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      if (img) formData.append('img', img); // Append file if it exists
      formData.append('id_type', breedTypeId);

      if (!breedId) {
        await apiClient.addBreed(formData); // Assuming addBreed uses FormData
      } else {
        await apiClient.updateBreed(breedId, formData); // Assuming updateBreed uses FormData
      }

      navigate('/manager-breed');
    } catch (error) {
      console.error(`${breedId ? 'Error updating' : 'Error adding'} breed:`, error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormDataState({ ...formDataState, img: e.target.files[0] }); // Set file
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold">{breedId ? 'Cập Nhật Giống' : 'Thêm Giống Mới'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Tên giống"
          value={formDataState.name}
          onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2"
        />
        <div>
          <label htmlFor="breedType" className="block text-sm font-medium text-gray-700">
            Loại giống
          </label>
          <select
            id="breedType"
            value={formDataState.breedTypeId || ''}
            onChange={(e) => setFormDataState({ ...formDataState, breedTypeId: e.target.value })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Chọn loại giống</option>
            {breedTypes.map((breedType) => (
              <option key={breedType._id} value={breedType._id}>
                {breedType.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          {breedId ? 'Cập Nhật Giống' : 'Thêm Giống'}
        </button>
      </form>
    </div>
  );
};

export default BreedForm;
