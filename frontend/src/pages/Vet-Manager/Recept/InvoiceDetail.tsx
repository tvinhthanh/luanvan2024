import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { InvoiceType, OwnerType, MedicType, VetCType } from "../../../../../backend/src/shared/types";
import MyVetInfo from "../Vet/VetInfo";
import { useAppContext } from "../../../contexts/AppContext";

const InvoiceDetail: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [namesMap, setNamesMap] = useState<{ [key: string]: string }>({});
  const [record, setRecord] = useState<MedicType | null>(null);
  const [now, setInvoice] = useState<InvoiceType | null>(null);
  const { userId, id_vet } = useAppContext();

  // Fetch invoice detail query
  const { data: invoice, isLoading: isLoadingInvoice, error: invoiceError } = useQuery<InvoiceType>(
    ["fetchInvoice", invoiceId],
    () => apiClient.fetchInvoiceById(invoiceId || ""),
    {
      enabled: !!invoiceId,
      onError: (err) => {
        console.error("Error fetching invoice:", err);
      },
      onSuccess: (data) => {
        if (data) {
          setInvoice(data);
        }
      },
    }
  );

  const { data: medicalRecord } = useQuery<MedicType>(
    ["fetchMedicalRecordById", invoice?.medicalRecordId],
    () => apiClient.fetchMedicalRecordById(invoice?.medicalRecordId || ""),
    {
      enabled: !!invoice?.medicalRecordId,
      onError: (err) => {
        console.error("Error fetching medical record:", err);
      },
    }
  );

  const { data: owner } = useQuery<OwnerType>(
    ["fetchOwnerById", medicalRecord?.ownerId || ""],
    () => apiClient.fetchOwnerById(medicalRecord?.ownerId || ""),
    {
      enabled: !!medicalRecord?.ownerId,
      onError: (err) => {
        console.error("Error fetching owner information:", err);
      },
    }
  );

  const { data: vet } = useQuery<VetCType[]>(
    ["fetchMyVet", userId],
    () => apiClient.fetchMyVets(userId),
    {
      onError: (err) => {
        console.error("Error fetching vet information:", err);
      },
    }
  );

  const handlePrint = () => {
    window.print();
  };

  if (isLoadingInvoice) return <p>Loading...</p>;
  if (invoiceError) return <p>Error loading invoice</p>;
  if (!invoice) return <p>No invoice found</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
        
      <h1 className="text-3xl font-extrabold text-center mb-8">Chi tiết Hoá Đơn</h1>
      <MyVetInfo />

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="printable">
          <h2 className="text-xl font-semibold mb-4">Chi tiết hoá đơn</h2>
          <div className="border-t-2 border-gray-200 pt-4">
            <p className="text-lg font-medium">Tên khách hàng: <span className="font-normal">{owner?.name}</span></p>
            <p className="text-lg font-medium mt-2">Ngày: <span className="font-normal">{new Date(invoice.createdAt).toLocaleDateString()}</span></p>
            <p className="text-lg font-medium">Thời gian: <span className="font-normal">{new Date(invoice.createdAt).toLocaleTimeString()}</span></p>
          </div>

          {/* Display Medications */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Thuốc:</h3>
            {invoice.medications.length > 0 ? (
              <ul>
                {invoice.medications.map((med) => (
                  <li key={med._id} className="mb-2">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">Tên: {med.name}</span>
                      <span className="font-medium">Giá: {med.price.toFixed(3)} VNĐ</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Không có thuốc</p>
            )}
          </div>

          {/* Display Services */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Dịch vụ:</h3>
            {invoice.services.length > 0 ? (
              <ul>
                {invoice.services.map((service) => (
                  <li key={service._id} className="mb-2">
                    <div className="flex justify-between w-full">
                      <span className="font-medium">Tên: {service.name}</span>
                      <span className="font-medium">Giá: {service.price}.000 VNĐ</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Không có dịch vụ</p>
            )}
          </div>

          <div className="border-t-2 border-gray-200 pt-4 mt-6">
            <p className="text-lg font-semibold text-left">Tổng cộng: <span className="text-red-600 text-3xl">{invoice.total.toFixed(3)} VNĐ</span></p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            In hoá đơn
          </button>
        </div>
      </div>

      {/* CSS for printing */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable, .printable * {
              visibility: visible;
            }
            .printable {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InvoiceDetail;
