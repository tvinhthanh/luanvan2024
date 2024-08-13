import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InvoiceType, OwnerType, PetType, MedicType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ManagerInvoice: React.FC = () => {
  const { id_vet } = useAppContext();
  const queryClient = useQueryClient();
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});
  const [recordsMap, setRecordsMap] = useState<{ [key: string]: MedicType }>({});
  const navigate = useNavigate();

  // Fetch invoices query
  const { data: invoices = [], isLoading: isLoadingInvoices, error: invoicesError } = useQuery<InvoiceType[]>(
    "fetchInvoices",
    () => apiClient.fetchInvoicesForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching invoices:", err);
      },
    }
  );

  // Fetch medical records query
  const { data: medicalRecords = [], isLoading: isLoadingRecords, error: recordsError } = useQuery<MedicType[]>(
    "fetchMedicalRecords",
    () => apiClient.fetchMedicalRecordsByVetId(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching medical records:", err);
      },
      onSuccess: (data) => {
        // Map medical records for quick lookup
        const map = data.reduce((acc: { [key: string]: MedicType }, record: MedicType) => {
          acc[record._id] = record;
          return acc;
        }, {});
        setRecordsMap(map);
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

  // Mutation for deleting invoice
  const deleteInvoiceMutation = useMutation(apiClient.deleteInvoice, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchInvoices"); // Invalidate cache to trigger refetch
    },
    onError: (error: Error) => {
      console.error("Error deleting invoice:", error);
    },
  });

  // Function to handle deletion
  const handleDelete = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoiceMutation.mutateAsync(invoiceId);
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const handleChoice = (invoiceId: string) => {
    navigate(`/invoice/${invoiceId}`); // Redirect to InvoiceDetail page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Hóa Đơn</h1>

      {isLoadingInvoices || isLoadingRecords ? (
        <span>Loading...</span>
      ) : invoicesError || recordsError ? (
        <span>Error loading data</span>
      ) : invoices.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Pet Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Owner Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Date</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Time</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Total</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const record = recordsMap[invoice.medicalRecordId];
              return (
                <tr key={invoice._id}>
                  <td className="px-4 py-2 border-b">{record ? namesMap[record.petId] || ` ${record.petId}` : 'Unknown'}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{record ? namesMap[record.ownerId] || ` ${record.ownerId}` : 'Unknown'}</td>
                  <td className="px-4 py-2 border-b">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{new Date(invoice.createdAt).toLocaleTimeString()}</td>
                  <td className="px-4 py-2 border-b">{invoice.total.toFixed(3)}VNĐ</td>
                  <td className="px-4 py-2 border-b flex space-x-2">
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    </button>
                    <button
                      onClick={() => handleChoice(invoice._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-xl text-gray-600 mt-4">No invoices found</p>
      )}
    </div>
  );
};

export default ManagerInvoice;
