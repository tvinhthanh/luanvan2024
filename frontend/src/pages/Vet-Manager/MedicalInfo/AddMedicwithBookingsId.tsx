import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { OwnerType, PetType, MedicType, MedicationType, RecordType, BookingType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const AddMedicalRecordWithBookId: React.FC = () => {
  const { bookingsId } = useParams<{ bookingsId: string }>();
  const { id_vet } = useAppContext();
  const [petName, setPetName] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [recordId, setRecordId] = useState<string>("");
  const [visitDate] = useState<string>("");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [treatmentPlan, setTreatmentPlan] = useState<string>("");
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading: isBookingLoading, error: bookingError } = useQuery<BookingType>(
    ["fetchBooking", bookingsId],
    () => apiClient.fetchBookingById(bookingsId as string),
    {
      enabled: !!bookingsId,
      onSuccess: async (data) => {
        try {
          const ownerData = await apiClient.fetchOwnerById(data.ownerId);
          const petData = await apiClient.fetchPetById(data.petId);
          setOwnerName(ownerData.name);
          setPetName(petData.name);
        } catch (error) {
          console.error("Error fetching owner or pet details:", error);
        }
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
    const fetchRecords = async () => {
      try {
        if (booking?.petId && id_vet) {
          const fetchedRecords: RecordType[] = await apiClient.fetchRecordsByPet(booking.petId, id_vet);
          setRecordId(fetchedRecords.length === 1 ? fetchedRecords[0]._id : "");
        } else {
          setRecordId("");
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, [booking?.petId, id_vet]);

  const addMedicalRecordMutation = useMutation(apiClient.createMedicalRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchMedicalRecordsForVet", id_vet]);
      navigate(`/medical-record`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonForVisit) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const newMedicalRecord: MedicType = {
        _id: "",
        petId: booking?.petId || "",
        ownerId: booking?.ownerId || "",
        vetId: id_vet,
        visitDate: new Date(visitDate),
        reasonForVisit,
        symptoms,
        diagnosis,
        treatmentPlan,
        medications,
        bookingsId: booking?._id as string,
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

  if (isMedicationsLoading || isBookingLoading) {
    return <span>Loading...</span>;
  }

  if (medicationsError || bookingError) {
    return <span>Error loading data</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm phiếu khám</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <input
            type="text"
            value={ownerName}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet</label>
          <input
            type="text"
            value={petName}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
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
          <label className="block text-sm font-medium text-gray-700">Phác đồ điều trị</label>
          <input
            type="text"
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Medications</label>
          <select
            value={selectedMedicationId}
            onChange={(e) => setSelectedMedicationId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Medication</option>
            {availableMedications.map((medication) => (
              <option key={medication._id} value={medication._id}>
                {medication.name} - {medication.dosage} - {medication.instructions} - {medication.price.toFixed(3)} VND
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const selectedMedication = availableMedications.find((med) => med._id === selectedMedicationId);
              if (selectedMedication) {
                setMedications([...medications, selectedMedication]);
              }
            }}
            className="mt-2 bg-blue-500 text-white p-2 rounded-md"
          >
            Add Medication
          </button>
          <ul className="mt-2">
            {medications.map((med, index) => (
              <li key={med._id} className="flex items-center justify-between p-2 border-b border-gray-300">
              {med.name} - {med.dosage} - {med.instructions}

                <button
                  type="button"
                  onClick={() => handleRemoveMedication(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-md"
        >
          Thêm phiếu khám
        </button>
      </form>
    </div>
  );
};

export default AddMedicalRecordWithBookId;
