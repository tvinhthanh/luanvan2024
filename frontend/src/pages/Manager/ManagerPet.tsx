import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import { PetType, OwnerType, BreedType } from "../../../../backend/src/shared/types"; // Ensure these types are defined properly

const ManagerPet: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetching the list of pets
  const { data: pets, error: petsError, isLoading: petsLoading } = useQuery<PetType[], Error>("fetchPets", apiClient.fetchpet);

  // Fetching the list of owners
  const { data: owners, error: ownersError, isLoading: ownersLoading } = useQuery<OwnerType[], Error>("fetchOwners", apiClient.fetchOwner);

  // Fetching the list of breed types
  const { data: breedTypes, error: breedTypesError, isLoading: breedTypesLoading } = useQuery<BreedType[], Error>("fetchBreedTypes", apiClient.fetchBreedType);

  // Mutation for deleting a pet
  const deletePetMutation = useMutation(apiClient.deletePet, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchPets");
    },
  });

  // Handling pet delete
  const handleDelete = (petId: string) => {
    deletePetMutation.mutate(petId);
  };

  // Display loading state
  if (petsLoading || ownersLoading || breedTypesLoading) {
    return <div>Loading...</div>;
  }

  // Display error state
  if (petsError) {
    return <div>Error loading pets: {petsError.message}</div>;
  }

  if (ownersError) {
    return <div>Error loading owners: {ownersError.message}</div>;
  }

  if (breedTypesError) {
    return <div>Error loading breed types: {breedTypesError.message}</div>;
  }

  // Create a map of ownerId to ownerName for quick lookup
  const ownerMap = new Map<string, string>();
  owners?.forEach((owner) => {
    ownerMap.set(owner._id, owner.name);
  });

  // Create a map of breedId to breedName for quick lookup
  const breedMap = new Map<string, string>();
  breedTypes?.forEach((breed) => {
    breedMap.set(breed._id, breed.name);
  });

  // Display the form and list of pets
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pet Management</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weigh</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sex</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pets?.map((pet: PetType) => (
            <tr key={pet._id}>
              <td className="px-6 py-4 whitespace-nowrap">{pet.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pet.age}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pet.weigh}</td>
              <td className="px-6 py-4 whitespace-nowrap">{breedMap.get(pet.breed_id) || 'Unknown'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{ownerMap.get(pet.owner_id) || 'Unknown'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pet.sex}</td>
              <td className="px-6 py-4 whitespace-nowrap">{pet.breed_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={pet.img} alt={pet.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleDelete(pet._id)}
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
  );
};

export default ManagerPet;
