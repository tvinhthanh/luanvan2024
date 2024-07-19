import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InvoiceType, OwnerType, PetType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ManagerInvoice: React.FC = () => {
  const { id_vet } = useAppContext();
  const queryClient = useQueryClient();
  const [ownerNames, setOwnerNames] = useState<{ [key: string]: string }>({});

  // Fetch invoices query
  const { data: invoices = [], isLoading, error } = useQuery<InvoiceType[]>(
    "fetchInvoices",
    () => apiClient.fetchInvoicesForVet(id_vet),
    {
      onError: (err) => {
        console.error("Error fetching invoices:", err);
      },
    }
  );
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});

  // Effect to fetch and store owner names
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch pets and owners
        const petsResponse = await apiClient.fetchpet();
        const ownersResponse = await apiClient.fetchOwner();

        // Map IDs to names
        const petNames = petsResponse.reduce((acc: { [key: string]: string }, pet: PetType) => {
          acc[pet._id] = pet.name;
          return acc;
        }, {});
        const ownerNames = ownersResponse.reduce((acc: { [key: string]: string }, owner: OwnerType) => {
          acc[owner._id] = owner.name;
          return acc;
        }, {});

        // Merge all mappings into one namesMap
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Quản Lý Hóa Đơn</h1>

      {isLoading ? (
        <span>Loading...</span>
      ) : error ? (
        <span>Error loading invoices</span>
      ) : invoices.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Pet Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Owner Name</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Date</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Total</th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td className="px-4 py-2 border-b">{invoice.petName}</td>
                <td className="py-2 px-4 border-b border-gray-300">{namesMap[invoice.ownerId] || `Owner ${invoice.ownerId}`}</td>
                <td className="px-4 py-2 border-b">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">${invoice.total.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xl text-gray-600 mt-4">No invoices found</p>
      )}
    </div>
  );
};

export default ManagerInvoice;
