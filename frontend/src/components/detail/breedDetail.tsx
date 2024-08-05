import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as apiClient from '../../api-client';
import { Breed } from '../../../../backend/src/shared/types';

const BreedDetail: React.FC = () => {
  const { breedId } = useParams<{ breedId: any }>();
  const [breed, setBreed] = useState<Breed | null>(null);

  useEffect(() => {
    if (breedId) {
      fetchBreed();
    }
  }, [breedId]);

  const fetchBreed = async () => {
    try {
      const breedData: Breed = await apiClient.fetchBreedById(breedId);
      setBreed(breedData);
    } catch (error) {
      console.error('Error fetching breed details:', error);
    }
  };

  if (!breed) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{breed.name}</h1>
      {breed.img && <img src={breed.img} alt={breed.name} className="w-48 h-48 object-cover mb-4" />}
      <p><strong>Type:</strong> {breed.id_type}</p>
      {/* Thêm các thông tin chi tiết khác nếu cần */}
    </div>
  );
};

export default BreedDetail;
