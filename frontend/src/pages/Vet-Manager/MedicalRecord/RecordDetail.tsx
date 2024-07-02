import React from 'react';
import { useQuery } from 'react-query';
import { fetchMedicalRecordsByVetId } from '../../../api-client';
import { MedicType } from '../../../../../backend/src/shared/types'; // Assuming MedicalRecordType is imported from shared types

interface MedicalRecordDetailProps {
  id_vet: string;
}

const MedicalRecordDetail: React.FC<MedicalRecordDetailProps> = ({ id_vet }) => {
  const { data: medicalRecord, isLoading, error } = useQuery<MedicType>(
    ['fetchMedicalRecord', id_vet],
    () => fetchMedicalRecordsByVetId(id_vet)
  );

  if (isLoading) {
    return <span>Loading medical record...</span>;
  }

  if (error) {
    return <span>Error loading medical record</span>;
  }

  if (!medicalRecord) {
    return <span>No medical record found</span>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Medical Record Detail</h2>
      <p><strong>Pet ID:</strong> {medicalRecord.petId}</p>
      <p><strong>Owner ID:</strong> {medicalRecord.ownerId}</p>
      <p><strong>Vet ID:</strong> {medicalRecord.vetId}</p>
      <p><strong>Visit Date:</strong> {new Date(medicalRecord.visitDate).toLocaleDateString()}</p>
      <p><strong>Reason for Visit:</strong> {medicalRecord.reasonForVisit}</p>
      <p><strong>Symptoms:</strong> {medicalRecord.symptoms}</p>
      <p><strong>Diagnosis:</strong> {medicalRecord.diagnosis}</p>
      <p><strong>Treatment Plan:</strong> {medicalRecord.treatmentPlan}</p>      
      <p><strong>Notes:</strong> {medicalRecord.notes}</p>
    </div>
  );
};

export default MedicalRecordDetail;
