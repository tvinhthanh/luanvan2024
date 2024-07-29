import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PetType, OwnerType, MedicType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import MyVetInfo from "../Vet/VetInfo";
import { useQuery, useMutation, useQueryClient } from "react-query";
import MedicationName from "./MedicationsName";

// const MedicationName: React.FC<{ medicationIds: string[] }> = ({ medicationIds }) => {
//   const firstMedicationId = medicationIds[0];
//   const { data: medication, error, isLoading } = useQuery(
//     ["fetchMedication", firstMedicationId],
//     () => apiClient.fetchMedicationsById(firstMedicationId),
//     {
//       enabled: !!firstMedicationId, // Query only if firstMedicationId exists
//     }
//   );

//   if (isLoading) return <span>Loading...</span>;
//   if (error) return <span>Error fetching medication name</span>;

//   return <span>{medication?.name || "Unknown Medication"}</span>;
// };
const DetailRecords: React.FC = () => {
  const location = useLocation();
  const { petId, ownerId } = location.state || {};

  const [newWeight, setNewWeight] = useState<string | number>("");
  const [isEditingWeight, setIsEditingWeight] = useState<boolean>(false);

  const { data: pet, error: petError, isLoading: petLoading } = useQuery<PetType>(
    ["fetchPet", petId],
    () => apiClient.fetchPetById(petId)
  );

  const { data: owner, error: ownerError, isLoading: ownerLoading } = useQuery<OwnerType>(
    ["fetchOwner", ownerId],
    () => apiClient.fetchOwnerById(ownerId)
  );

  const { data: medicalRecords, error: medicalRecordsError, isLoading: medicalRecordsLoading } = useQuery<MedicType[]>(
    ["fetchMedicalRecords", petId],
    () => apiClient.fetchMedicalRecordsByPet(petId)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (updatedWeight: string | number) => apiClient.updatePetWeight(petId, updatedWeight),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchPet", petId]);
        setIsEditingWeight(false);
      },
      onError: (error) => {
        console.error('Error updating weight:', error);
      }
    }
  );

  const handleWeightUpdate = (event: React.FormEvent) => {
    event.preventDefault();
    if (newWeight) {
      mutation.mutate(newWeight);
    }
  };

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
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => setIsEditingWeight(true)}
          >
            Sửa cân nặng
          </button>

          {isEditingWeight && (
            <form onSubmit={handleWeightUpdate} className="mt-4">
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="border rounded p-2"
                placeholder="Nhập cân nặng mới"
                required
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={() => setIsEditingWeight(false)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Hủy
              </button>
            </form>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 col-span-3 mb-6">
          <h2 className="text-2xl font-semibold mb-2">Lịch sử bệnh án</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Ngày khám</th>
                <th className="py-2 px-4">Thuốc</th>
                <th className="py-2 px-4">Lí do</th>
                <th className="py-2 px-4">Kế hoạch điều trị</th>
                <th className="py-2 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicalRecords?.map((record: MedicType) => (
                <tr key={record._id}>
                  <td className="py-2 px-4">{new Date(record.visitDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <MedicationName medicationIds={record.medications} />
                  </td>
                  <td className="py-2 px-4">{record.reasonForVisit}</td>
                  <td className="py-2 px-4">{record.treatmentPlan}</td>
                  <td className="py-2 px-4">{record.notes}</td>
                </tr>
              ))}
              {medicalRecordsError && (
                <tr>
                  <td className="py-2 px-4" colSpan={5}>
                    Error fetching medical records
                  </td>
                </tr>
              )}
              {!medicalRecordsLoading && !medicalRecords && !medicalRecordsError && (
                <tr>
                  <td className="py-2 px-4" colSpan={5}>
                    No medical records found
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
