import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, useQueries } from "react-query";
import * as apiClient from "../../../api-client";
import { MedicType, MedicationType, PetType, OwnerType } from "../../../../../backend/src/shared/types";

const MedicalRecordDetail: React.FC = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch medical record
  const {
    data: medicalRecord,
    isLoading: isRecordLoading,
    error: recordError,
  } = useQuery<MedicType>(
    ["fetchMedicalRecordById", recordId],
    () => apiClient.fetchMedicalRecordById(recordId || ""),
    {
      enabled: !!recordId,
      onError: (err) => {
        console.error("Error fetching medical record:", err);
      },
    }
  );

  // Fetch pet information
  const {
    data: pet,
    isLoading: isPetLoading,
    error: petError,
  } = useQuery<PetType>(
    ["fetchPetById", medicalRecord?.petId || ""],
    () => apiClient.fetchPetById(medicalRecord?.petId || ""),
    {
      enabled: !!medicalRecord?.petId,
      onError: (err) => {
        console.error("Error fetching pet information:", err);
      },
    }
  );
  // Fetch owner information
  const {
    data: owner,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useQuery<OwnerType>(
    ["fetchOwnerById", medicalRecord?.ownerId || ""],
    () => apiClient.fetchOwnerById(medicalRecord?.ownerId || ""),
    {
      enabled: !!medicalRecord?.ownerId,
      onError: (err) => {
        console.error("Error fetching owner information:", err);
      },
    }
  );
  // Handle deleting medical record
  const deleteMedicalRecordMutation = useMutation(
    (recordId: string) => apiClient.deleteMedicalRecord(recordId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchMedicalRecordById", recordId]);
        navigate("/medical-record"); // Redirect to medical records page after deletion
      },
      onError: (error: Error) => {
        console.error("Error deleting medical record:", error);
      },
    }
  );

  // Fetch medications
  const medicationQueries = useQueries(
    (medicalRecord?.medications || []).map((medicationId) => ({
      queryKey: ["fetchMedication", medicationId],
      queryFn: () => apiClient.fetchMedicationsById(medicationId),
      enabled: !!medicalRecord,
      onError: (error: any) => {
        console.error("Error fetching medication:", error);
      },
    }))
  );

  const medications: MedicationType[] = medicationQueries
    .flatMap((query) => query.data || [])
    .filter((data): data is MedicationType => data !== undefined);

  const handleDelete = async () => {
    if (!medicalRecord || !recordId) return;

    const confirmed = window.confirm("Bạn có chắc chắn muốn xoá phiếu khám này không?");
    if (!confirmed) return;

    try {
      await deleteMedicalRecordMutation.mutateAsync(recordId);
      navigate(`/medical-record`)
    } catch (error) {
      console.error("Error deleting medical record:", error);
    }
  };

  const handleCreateInvoice = async () => {
    if (!medicalRecord || !recordId || !owner || !pet) return;

    try {
      // Ensure medications are an array of strings
      const medications = medicalRecord.medications.map((medId) => medId.toString());

      navigate(`/create-invoice`, { state: { medicalRecord: { ...medicalRecord, medications }, pet, ownerId: owner._id } });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  if (isRecordLoading || isPetLoading || isOwnerLoading) {
    return <span>Loading...</span>;
  }

  if (recordError || !medicalRecord) {
    return <span>Error: Medical record not found</span>;
  }

  if (petError || !pet) {
    return <span>Error: Pet information not found</span>;
  }

  if (ownerError || !owner) {
    return <span>Error: Owner information not found</span>;
  }

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">
        Phiếu khám của {pet.name}
      </h3>
      <p>
        <strong>Ngày:</strong>{" "}
        {new Date(medicalRecord.visitDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Chủ nhân:</strong> {owner.name}
      </p>
      <p>
        <strong>Lí do khám:</strong> {medicalRecord.reasonForVisit}
      </p>
      <p>
        <strong>Chuẩn đoán:</strong> {medicalRecord.symptoms}
      </p>
      <p>
        <strong>Triệu chứng:</strong> {medicalRecord.diagnosis}
      </p>
      <p>
        <strong>Kế hoạch điều trị:</strong> {medicalRecord.treatmentPlan}
      </p>
      {medicalRecord.notes && (
        <p>
          <strong>Notes:</strong> {medicalRecord.notes}
        </p>
      )}
      <div className="mt-4">
        <h4 className="font-bold">Thuốc sử dụng:</h4>
        <ul>
          {medications.map((medication) => (
            <li key={medication._id}>
              <p>
                <strong>Tên:</strong> {medication.name}
              </p>
              <p>
                <strong>Giá:</strong> {parseFloat(medication.price.toString()).toFixed(3)} VNĐ
              </p>
              <p>
                <strong>--------------------</strong>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Xoá phiếu khám
        </button>
        <button
          onClick={handleCreateInvoice}
          className={`bg-green-500 text-white px-4 py-2 rounded-md ${medicalRecord.hasInvoice ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={medicalRecord.hasInvoice ? true : undefined}
        >
          Tạo hoá đơn
        </button>
        <button
          onClick={() => navigate("/medical-record")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordDetail;
