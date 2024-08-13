import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MedicType, PetType, MedicationType, ServiceType, InvoiceType, OwnerType } from "../../../../../backend/src/shared/types";
import * as apiClient from "../../../api-client";
import { useMutation, useQueries, useQuery } from "react-query";
import { useAppContext } from "../../../contexts/AppContext";
import ServicesList from "./CashService";

const AddInvoice: React.FC = () => {
  const { id_vet } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { medicalRecord, pet, ownerId } = location.state as { medicalRecord: MedicType; pet: PetType; ownerId: string; medications: MedicationType[] };

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Fetch services
  const { data: services, isLoading: isServicesLoading, error: servicesError } = useQuery<ServiceType[]>(
    "fetchServices",
    () => apiClient.fetchServicesForVet(id_vet),
    {
      enabled: !!medicalRecord,
      onError: (err) => {
        console.error("Error fetching services:", err);
      }
    }
  );
  const { data: owner, isLoading: isOwnerLoading, error: ownerError } = useQuery<OwnerType>(
    "fetchOwner",
    () => apiClient.fetchOwnerById(ownerId),
    {
      enabled: !!medicalRecord,
      onError: (err) => {
        console.error("Error fetching services:", err);
      }
    }
  );
  // Filter services to only show available ones
  const availableServices = services?.filter(service => service.available) || [];

  // Fetch medications using medicalRecord.medications IDs
  const medicationQueries = useQueries(
    (medicalRecord.medications || []).map((medicationId) => ({
      queryKey: ["fetchMedication", medicationId],
      queryFn: () => apiClient.fetchMedicationsById(medicationId),
      enabled: !!medicalRecord,
      onError: (error: any) => {
        console.error("Error fetching medication:", error);
      },
    }))
  );
  const medications: MedicationType[] = medicationQueries
    .map((query) => query.data)
    .flat() // Flatten the array to get the medication objects directly
    .filter((data): data is MedicationType => data !== undefined); // Type guard to ensure data is MedicationType

  const createInvoiceMutation = useMutation(
    (invoiceData: InvoiceType) => apiClient.createInvoice(invoiceData),
    {
      onSuccess: (invoice) => {
        console.log("Invoice created:", invoice);
        navigate(`/manager-invoice`); // Redirect to invoice page after creation
      },
      onError: (error: Error) => {
        console.error("Error creating invoice:", error);
      },
    }
  );

  const handleServiceSelection = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const calculateTotal = () => {
    let total = 0;

    // Calculate total for medications
    medications.forEach((medication) => {
      total += parseFloat(medication.price.toString()); // Ensure price is treated as a string
    });

    // Calculate total for selected services
    selectedServices.forEach((serviceId) => {
      const selectedService = availableServices.find(
        (service) => service._id === serviceId
      );
      if (selectedService) {
        total += parseFloat(selectedService.price.toString()); // Ensure price is treated as a string
      }
    });

    return total.toFixed(3); // Format total to 2 decimal places
  };

  const handleCreateInvoice = async () => {
    const total = Number(calculateTotal());

    const selectedServiceObjects = selectedServices.map((serviceId) => {
      const selectedService = availableServices.find((service) => service._id === serviceId);
      return selectedService ? { _id: selectedService._id } : null;
    }).filter(Boolean) as ServiceType[];

    const medicationObjects = medications.map((medication) => ({
      _id: medication._id,
    }));

    const invoiceData: InvoiceType = {
      medicalRecordId: medicalRecord._id,
      medications: medicationObjects, // Ensure _id is converted to string
      services: selectedServiceObjects, // Ensure _id is converted to string
      vetId: id_vet,
      total: total,
    };

    try {
      await createInvoiceMutation.mutateAsync(invoiceData);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  if (isServicesLoading || medicationQueries.some((query) => query.isLoading )|| isOwnerLoading) {
    return <span>Loading services and medications...</span>;
  }

  if (servicesError || medicationQueries.some((query) => query.error) || ownerError) {
    return <span>Error fetching services or medications</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tạo hoá đơn</h1>
      <p> 
        <strong>Tên thú cưng:</strong> {pet.name}
      </p>
      <p>
        <strong>Tên chủ nhân :</strong> {owner?.name}
      </p>
      <p>
        <strong>Ngày khám:</strong> {new Date(medicalRecord.visitDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Lí do khám:</strong> {medicalRecord.reasonForVisit}
      </p>

      {/* Render Medications */}
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
            </li>
          ))}
        </ul>
      </div>

      {/* Select Services */}
      <div className="mt-4">
        <h4 className="font-bold">Dịch vụ thêm:</h4>
        <ServicesList 
          services={availableServices}
          selectedServices={selectedServices}
          handleServiceSelection={handleServiceSelection}
        />
      </div>

      {/* Total Calculation */}
      <div className="mt-4">
        <h4 className="font-bold">Tổng:</h4>
        <p>{calculateTotal()} VNĐ</p>
      </div>

      <button
        onClick={handleCreateInvoice}
        className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Tạo Hoá Đơn
      </button>
    </div>
  );
};

export default AddInvoice;
