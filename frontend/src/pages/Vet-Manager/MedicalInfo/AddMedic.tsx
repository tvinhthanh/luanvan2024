import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { OwnerType, PetType, MedicType, MedicationType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const AddMedicalRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const [petId, setPetId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [recordId, setRecordId] = useState<string>("");
  const [visitDate, setVisitDate] = useState(""); // Sửa đây để có thể thay đổi giá trị
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [notes, setNotes] = useState("");
  const [pets, setPets] = useState<PetType[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>("");
  const [isOwnerSelected, setIsOwnerSelected] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: owners = [], isLoading: isOwnersLoading, error: ownersError } = useQuery<OwnerType[]>(
    "fetchOwners",
    apiClient.fetchOwner,
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  const { data: availableMedications = [], isLoading: isMedicationsLoading, error: medicationsError } = useQuery<MedicationType[]>(
    ["fetchMedications", id_vet],
    () => apiClient.fetchMedicationsForVet(id_vet),
    {
      enabled: !!id_vet,
      onError: (err) => {
        console.error("Error fetching medications:", err);
      },
    }
  );
  useEffect(() => {
    const fetchPets = async () => {
      if (ownerId) {
        try {
          const fetchedPets: PetType[] = await apiClient.fetchPetByOwnerId(ownerEmail);
          setPets(fetchedPets);
        } catch (error) {
          console.error("Error fetching pets:", error);
        }
      } else {
        setPets([]);
      }
    };

    fetchPets();
  }, [ownerId]);

  useEffect(() => {
    if (ownerPhone) {
      const fetchOwnerByPhone = async () => {
        try {
          const fetchedOwner = await apiClient.fetchOwnerByPhone(ownerPhone);
          if (fetchedOwner) {
            setOwnerEmail(fetchedOwner.email);
            setOwnerId(fetchedOwner._id);
            setIsOwnerSelected(true);
          } else {
            setOwnerEmail("");
            setOwnerId("");
            setIsOwnerSelected(false);
          }
        } catch (error) {
          // console.error("Error fetching owner by phone:", error);
        }
      };

      fetchOwnerByPhone();
    }
  }, [ownerPhone]);

  const addMedicalRecordMutation = useMutation(apiClient.createMedicalRecordWithoutBooking, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchMedicalRecordsForVet", id_vet]);
      navigate(`/medical-record`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medications.length || !treatmentPlan || !reasonForVisit) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const newMedicalRecord: MedicType = {
        _id: "",
        petId,
        ownerId,
        vetId: id_vet,
        visitDate: new Date(visitDate),
        reasonForVisit,
        symptoms,
        diagnosis,
        treatmentPlan,
        medications,
        bookingsId: "",
        notes,
        hasInvoice: false,
      };

      await addMedicalRecordMutation.mutateAsync(newMedicalRecord);
    } catch (error) {
      console.error("Error adding medical record:", error);
    }
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const handleMedicationAdd = () => {
    const selectedMedication = availableMedications.find(
      (med) => med._id === selectedMedicationId
    );
    if (selectedMedication) {
      setMedications([...medications, selectedMedication]);
      setSelectedMedicationId("");
    }
  };

  if (isOwnersLoading || isMedicationsLoading) {
    return <span>Loading...</span>;
  }

  if (ownersError || medicationsError) {
    return <span>Error loading data</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm phiếu khám</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isOwnerSelected ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Chọn chủ sở hữu</label>
              <select
                value={ownerId}
                onChange={(e) => {
                  const selectedOwnerId = e.target.value;
                  const selectedOwner = owners.find(owner => owner._id === selectedOwnerId);
                  if (selectedOwner) {
                    setOwnerPhone(selectedOwner.phone);
                    setOwnerEmail(selectedOwner.email);
                    setOwnerId(selectedOwnerId);
                    setIsOwnerSelected(true);
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Chọn chủ sở hữu</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại của chủ sở hữu</label>
              <input
                type="text"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Chủ sở hữu</label>
            <input
              type="text"
              value={ownerEmail}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet</label>
              <select
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="">Chọn Pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lý do khám</label>
          <input
            type="text"
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Triệu chứng</label>
          <input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chuẩn đoán</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Kế hoạch điều trị</label>
          <input
            type="text"
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Thuốc</label>
          <select
            value={selectedMedicationId}
            onChange={(e) => setSelectedMedicationId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Chọn thuốc</option>
            {availableMedications.map((med) => (
              <option key={med._id} value={med._id}>
                {med.name} - {med.price} VND
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleMedicationAdd}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Thêm thuốc
          </button>
          <ul className="mt-4">
            {medications.map((med, index) => (
              <li key={med._id} className="flex items-center justify-between p-2 border-b border-gray-300">
                <span>{med.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(index)}
                  className="text-red-500"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Lưu
        </button>
      </form>
    </div>
  );
};

export default AddMedicalRecord;
