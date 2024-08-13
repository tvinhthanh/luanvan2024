// src/components/InvoiceDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { InvoiceType, OwnerType, PetType, MedicType } from "../../../../../backend/src/shared/types";
import { useAppContext } from "../../../contexts/AppContext";
import MyVetInfo from "../Vet/VetInfo";

const InvoiceDetail: React.FC = () => {
  const { id_vet } = useAppContext();
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});
  const [record, setRecord] = useState<MedicType | null>(null);

  // Fetch invoice detail query
  const { data: invoice, isLoading: isLoadingInvoice, error: invoiceError } = useQuery<InvoiceType>(
    ["fetchInvoice", invoiceId],
    () => apiClient.fetchInvoiceById(invoiceId|| "" ),
    {
      enabled: !!invoiceId,
      onError: (err) => {
        console.error("Error fetching invoice:", err);
      },
      onSuccess: (data) => {
        if (data.medicalRecordId) {
          apiClient.fetchMedicalRecordById(data.medicalRecordId).then(recordData => {
            setRecord(recordData);
          });
        }
      },
    }
  );

  // Effect to fetch and store names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const petsResponse = await apiClient.fetchpet();
        const ownersResponse = await apiClient.fetchOwner();

        const petNames = petsResponse.reduce((acc: { [key: string]: string }, pet: PetType) => {
          acc[pet._id] = pet.name;
          return acc;
        }, {});
        const ownerNames = ownersResponse.reduce((acc: { [key: string]: string }, owner: OwnerType) => {
          acc[owner._id] = owner.name;
          return acc;
        }, {});

        setNamesMap({ ...petNames, ...ownerNames });
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, []);

  if (isLoadingInvoice) return <p>Loading...</p>;
  if (invoiceError) return <p>Error loading invoice</p>;
  if (!invoice) return <p>No invoice found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
        <MyVetInfo/>
      <h1 className="text-2xl font-bold mb-6">Invoice Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Invoice ID: {invoice._id}</h2>
        <p><strong>Pet Name:</strong> {record ? namesMap[record.petId] || 'Unknown' : 'Loading...'}</p>
        <p><strong>Owner Name:</strong> {record ? namesMap[record.ownerId] || 'Unknown' : 'Loading...'}</p>
        <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(invoice.createdAt).toLocaleTimeString()}</p>
        <p><strong>Total:</strong> ${invoice.total.toFixed(2)}</p>
        <p><strong>Description:</strong> {record ? record.notes || 'No description available' : 'Loading...'}</p>
      </div>
    </div>
  );
};

export default InvoiceDetail;
