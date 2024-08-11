import React, { useState } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../../../api-client';
import { VetCType } from '../../../../../backend/src/shared/types';
import { Link } from 'react-router-dom';
import { useAppContext } from "../../../contexts/AppContext";

const MyVetInfo: React.FC = () => {
  const { userId, id_vet } = useAppContext();

  const { data: vetData, isLoading, error } = useQuery<VetCType[]>(['fetchMyVet', userId], () => apiClient.fetchMyVets(userId), {
    onError: (err) => {
      console.error('Error fetching vet information:', err);
    },
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (isLoading) {
    return <span>Loading...</span>; 
  }

  if (error) {
    return <span>Error loading vet information</span>;
  }

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Vets</h1>
      {vetData && vetData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {vetData.map((vet: VetCType) => (
            <div key={id_vet} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{vet.name}</h2>
              <p className="text-gray-700 mb-1"><strong>Địa chỉ:</strong> {vet.address}</p>
              <p className="text-gray-700 mb-1"><strong>Số điện thoại:</strong> {vet.phone}</p>
              <p className="text-gray-700 mb-1"><strong>Chú thích:</strong> {vet.description}</p>

              {vet.imageUrls && vet.imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {vet.imageUrls.map((url: string, idx: number) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Vet ${id_vet} - Image ${idx}`}
                      className="w-full h-32 object-cover cursor-pointer rounded-md"
                      onClick={() => handleImageClick(url)}
                    />
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-4">
                <Link
                  to={`/edit-vet/${id_vet}`}
                  state={{ vet }} // Pass the vet data through state
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Cập nhật Phòng khám
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-xl text-gray-600">No Vets found</p>
          <Link to="/add-vet" className="text-blue-500 hover:underline">Add Vet</Link>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default MyVetInfo;
