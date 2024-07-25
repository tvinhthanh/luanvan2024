import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../../../api-client";
import { OwnerType, PetType, MedicType, MedicationType, RecordType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";

const AddMedicalRecord: React.FC = () => {
  const { id_vet } = useAppContext();
  const [petId, setPetId] = useState("");
  const [ownerId, setOwnerId] = useState(""); // Initialize ownerId state
  const [ownerEmail, setOwnerEmail] = useState("");
  const [recordId, setRecordId] = useState<string>(""); // State for recordId
  const [visitDate] = useState("");
  const [reasonForVisit, setReasonForVisit] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [medications, setMedications] = useState<MedicationType[]>([]);
  const [notes, setNotes] = useState("");
  const [pets, setPets] = useState<PetType[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>(""); // State for selected medication ID

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch owners
  const { data: owners = [], isLoading: isOwnersLoading, error: ownersError } = useQuery<OwnerType[]>(
    "fetchOwners",
    apiClient.fetchOwner,
    {
      onError: (err) => {
        console.error("Error fetching owners:", err);
      },
    }
  );

  // Fetch available medications for the vet
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

  // Fetch pets by owner email when ownerEmail changes
  useEffect(() => {
    const fetchPets = async () => {
      if (ownerEmail) {
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
  }, [ownerEmail]);

  // Fetch records by petId when petId changes
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (petId) {
          const fetchedRecords: RecordType[] = await apiClient.fetchRecordsByPet(petId);
          setRecordId(fetchedRecords.length === 1 ? fetchedRecords[0]._id : "");
        } else {
          setRecordId("");
        }
      } catch (error) {
        console.error("Error fetching records:", error);
        // Handle the error
      }
    };

    fetchRecords();
  }, [petId]);

  // Mutation for adding a new medical record
  const addMedicalRecordMutation = useMutation(apiClient.createMedicalRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchMedicalRecordsForVet", id_vet]);
      navigate(`/medical-record`);
    },
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordId || !reasonForVisit) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const newMedicalRecord: MedicType = {
        _id: "", // This will be generated by MongoDB
        petId,
        ownerId,
        vetId: id_vet,
        recordId,
        visitDate: new Date(visitDate),
        reasonForVisit,
        symptoms,
        diagnosis,
        treatmentPlan,
        medications, // Ensure medications are of type MedicationType[]
        notes,
        hasInvoice:false,
      };

      await addMedicalRecordMutation.mutateAsync(newMedicalRecord);
    } catch (error) {
      console.error("Error adding medical record:", error);
    }
  };

  // Handle removing a medication from the list
  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  // Handle owner selection change
  const handleOwnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOwnerEmail = e.target.value;
    setOwnerEmail(selectedOwnerEmail);
    const selectedOwner = owners.find((owner) => owner.email === selectedOwnerEmail);
    setOwnerId(selectedOwner ? selectedOwner._id : "");
  };

  // Render loading state
  if (isOwnersLoading || isMedicationsLoading) {
    return <span>Loading...</span>;
  }

  // Render error state
  if (ownersError || medicationsError) {
    return <span>Error loading data</span>;
  }

  // Render the form once data is loaded
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm phiếu khám</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Owner</label>
          <select
            value={ownerEmail}
            onChange={handleOwnerChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Owner</option>
            {owners.map((owner) => (
              <option key={owner._id} value={owner.email}>
                {owner.name} - {owner.email}
              </option>
            ))}
          </select>
        </div>
        {ownerEmail && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pet</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Pet</option>
              {pets.map((pet) => (
                <option key={pet._id} value={pet._id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {petId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Record ID</label>
            <input
              type="text"
              value={recordId}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        )}
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
          <label className="block text-sm font-medium text-gray-700">Kế hoạch điều trị</label>
          <input
            type="text"
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Thuốc</label>
          <select
            value={selectedMedicationId}
            onChange={(e) => setSelectedMedicationId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Medication</option>
            {availableMedications.map((medication) => (
              <option key={medication._id} value={medication._id}>
                {medication.name} - {medication.dosage} - {medication.instructions}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const selectedMed = availableMedications.find((med) => med._id === selectedMedicationId);
              if (selectedMed) {
                setMedications([...medications, selectedMed]);
              }
            }}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Tạo phiếu khám
          </button>
          {medications.map((medication, index) => (
            <div key={index} className="mt-2 flex space-x-2">
              <input
                type="text"
                value={medication.name}
                readOnly
                className="block w-1/3 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                value={medication.dosage}
                readOnly
                className="block w-1/3 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                value={medication.instructions}
                readOnly
                className="block w-1/3 border border-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveMedication(index)}
                className="bg-red-500 text-white px-4 py-1 rounded-md ml-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Save Record
        </button>
      </form>
    </div>
  );
};

export default AddMedicalRecord;
