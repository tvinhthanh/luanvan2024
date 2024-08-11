import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { VetCType, MedicType, OwnerType, PetType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import MyVetInfo from "../Vet/VetInfo";

const MyVetMedic: React.FC = () => {
  const { userId, id_vet } = useAppContext();

  const {
    data: vetData,
    isLoading: isVetLoading,
    error: vetError,
  } = useQuery<VetCType[]>(
    ["fetchMyVet", userId],
    () => apiClient.fetchMyVets(userId),
    {
      onError: (err) => {
        console.error("Error fetching vet information:", err);
      },
    }
  );

  if (isVetLoading) {
    return <span>Loading...</span>;
  }

  if (vetError) {
    return <span>Error loading vet information</span>;
  }

  return (
    <div className="space-y-5">
      <MyVetInfo />
      <br/>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mt-5">Medical Records</h2>
        <Link
          to={`/add-medical`} // Adjust this path as needed
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
        </Link>
      </div>
      <div className="space-y-5">
        {vetData?.map((vet) => (
          <MedicalOfVet key={vet._id} id_vet={vet._id} />
        ))}
      </div>
    </div>
  );
};

const MedicalOfVet: React.FC<{ id_vet: string }> = ({ id_vet }) => {
  const { data: medicalRecords, isLoading, error } = useQuery<MedicType[]>(
    ["fetchMedicalRecordsByVetId", id_vet],
    () => apiClient.fetchMedicalRecordsByVetId(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching medical records:", err);
      },
    }
  );

  const { data: owners = [] } = useQuery<OwnerType[]>(
    "fetchOwners",
    () => apiClient.fetchOwner(),
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  const { data: pets = [] } = useQuery<PetType[]>(
    "fetchPets",
    () => apiClient.fetchpet(),
    {
      onError: (err) => {
        console.error("Error fetching pets:", err);
      },
    }
  );

  if (isLoading) {
    return <span>Loading medical records...</span>;
  }

  if (error) {
    return <span>Error loading medical records</span>;
  }

  if (!medicalRecords || medicalRecords.length === 0) {
    return <span>No medical records found</span>;
  }

  // Sort medical records by visitDate in descending order
  const sortedMedicalRecords = [...medicalRecords].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  return (
    <div className="space-y-3">
      {sortedMedicalRecords.map((record) => {
        const owner = owners.find((owner) => owner._id === record.ownerId);
        const pet = pets.find((pet) => pet._id === record.petId);
        return (
          <div
            key={record._id}
            className="border border-gray-200 p-4 rounded-lg shadow-md"
          >
            <Link to={`/medical-records/${record._id}`} className="text-500 hover:underline">
              <h3 className="text-lg font-bold">Bệnh Án của {pet ? pet.name : "Unknown Pet"}</h3>
            </Link>
            <p>
              <strong>Ngày:</strong>{" "}
              {new Date(record.visitDate).toLocaleDateString()}
              <strong> Giờ:</strong>{" "}
              {new Date(record.visitDate).toLocaleTimeString()}
            </p>
            <p>
              <strong>Lí do:</strong> {record.reasonForVisit}
            </p>
            <p>
              <strong>Triệu chứng:</strong> {record.symptoms}
            </p>
            <p>
              <strong>Chuẩn đoán:</strong> {record.diagnosis}
            </p>
            <p>
              <strong>Kế Hoạch Chữa Trị:</strong> {record.treatmentPlan}
            </p>
            <div>
              <strong>Thuốc: ...</strong>
            </div>
            {record.notes && (
              <p>
                <strong>Notes:</strong> {record.notes}
              </p>
            )}
            {owner && (
              <p>
                <strong>Owner:</strong> {owner.name}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyVetMedic;
