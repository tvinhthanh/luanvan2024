// DetailRecords.tsx

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PetType, OwnerType, MedicType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import MyVetInfo from "../Vet/VetInfo";
import { useQuery } from "react-query";

const DetailRecords: React.FC = () => {
  const location = useLocation();
  const { petId, ownerId } = location.state || {};

  // Fetch pet details
  const { data: pet, error: petError, isLoading: petLoading } = useQuery<PetType>(
    ["fetchPet", petId],
    () => apiClient.fetchPetById(petId)
  );

  // Fetch owner details
  const { data: owner, error: ownerError, isLoading: ownerLoading } = useQuery<OwnerType>(
    ["fetchOwner", ownerId],
    () => apiClient.fetchOwnerById(ownerId)
  );

  // Fetch medical records
  const { data: medicalRecords, error: medicalRecordsError, isLoading: medicalRecordsLoading } = useQuery<MedicType[]>(
    ["fetchMedicalRecords", petId],
    () => apiClient.fetchMedicalRecordsByPet(petId)
  );

  useEffect(() => {
    // Optional: Any side effects or additional logic here
  }, [pet, owner, medicalRecords]);

  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">
            <div className="container mx-auto p-4">
              <p className="mx-auto">
                {pet?.img || "N/A"}
              </p>
            </div>
          </h2>
        </div>
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <MyVetInfo />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 col-span-1 mb-6">
          <p>
            <strong>Tên:</strong> {pet?.name || "N/A"}
          </p>
          <p>
            <strong>Tuổi:</strong> {pet?.age || "N/A"}
          </p>
          <p>
            <strong>Giống:</strong> {pet?.breed_type || "N/A"}
          </p>
          <p>
            <strong>Loại:</strong> {pet?.breed_id || "N/A"}
          </p>
          <p>
            <strong>Cân nặng:</strong> {pet?.weight || "N/A"}
          </p>
          <p>
            <strong>Giới tính:</strong> {pet?.sex || "N/A"}
          </p>
          <p>
            <strong>Hình ảnh:</strong> {pet?.img || "N/A"}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 col-span-3 mb-6">
          <h2 className="text-2xl font-semibold mb-2">Lịch sử bệnh án</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
              <th className="py-2 px-4">Pet ID</th>
                <th className="py-2 px-4">Ngày khám</th>
                <th className="py-2 px-4">Lí do</th>
                <th className="py-2 px-4">Kế hoạch điều trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicalRecords?.map((record: any) => (
                <tr key={record._id}>
                  <td className="py-2 px-4">{record.petId}</td>
                  <td className="py-2 px-4">{new Date(record.visitDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{record.reasonForVisit}</td>
                  <td className="py-2 px-4">{record.treatmentPlan}</td>
                </tr>
              ))}
              {medicalRecordsError && (
                <tr>
                  <td className="py-2 px-4" colSpan={4}>
                    Error fetching medical records:
                  </td>
                </tr>
              )}
              {!medicalRecordsLoading && !medicalRecords && !medicalRecordsError && (
                <tr>
                  <td className="py-2 px-4" colSpan={4}>
                    No medical records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailRecords;
