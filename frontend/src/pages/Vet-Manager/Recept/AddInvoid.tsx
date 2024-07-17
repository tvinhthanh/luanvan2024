import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MedicType, PetType, MedicationType, ServiceType, InvoiceType } from "../../../../../backend/src/shared/types";
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
        navigate(`/invoices/${invoice._id}`); // Redirect to invoice page after creation
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
      const selectedService = services?.find(
        (service) => service._id === serviceId
      );
      if (selectedService) {
        total += parseFloat(selectedService.price.toString()); // Ensure price is treated as a string
      }
    });

    return total.toFixed(2); // Format total to 2 decimal places
  };

  const handleCreateInvoice = async () => {
    const total = Number(calculateTotal());

    const selectedServiceObjects = selectedServices.map((serviceId) => {
      const selectedService = services?.find((service) => service._id === serviceId);
      return selectedService ? { _id: selectedService._id } : null;
    }).filter(Boolean) as ServiceType[];

    const medicationObjects = medications.map((medication) => ({
      _id: medication._id,
      // name: medication.name,
      // dosage: medication.dosage,
      // instructions: medication.instructions,
      // price: medication.price,
    }));

    const invoiceData: InvoiceType = {
      medicalRecordId: medicalRecord._id,
      ownerId: medicalRecord.ownerId, // Assuming ownerId is available in medicalRecord
      petName: pet.name,
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

  if (isServicesLoading || medicationQueries.some((query) => query.isLoading)) {
    return <span>Loading services and medications...</span>;
  }

  if (servicesError || medicationQueries.some((query) => query.error)) {
    return <span>Error fetching services or medications</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Invoice</h1>
      <p>
        <strong>Pet Name:</strong> {pet.name}
      </p>
      <p>
        <strong>Owner Name:</strong> {ownerId}
      </p>
      <p>
        <strong>Visit Date:</strong> {new Date(medicalRecord.visitDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Reason for Visit:</strong> {medicalRecord.reasonForVisit}
      </p>

      {/* Render Medications */}
      <div className="mt-4">
        <h4 className="font-bold">Medications:</h4>
        <ul>
          {medications.map((medication) => (
            <li key={medication._id}>
              <p>
                <strong>Name:</strong> {medication.name}
              </p>
              <p>
                <strong>Dosage:</strong> {medication.dosage}
              </p>
              <p>
                <strong>Instructions:</strong> {medication.instructions}
              </p>
              <p>
                <strong>Price:</strong> ${parseFloat(medication.price.toString()).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Select Services */}
      <div className="mt-4">
        <h4 className="font-bold">Additional Services:</h4>
        <ServicesList 
          services={services || []}
          selectedServices={selectedServices}
          handleServiceSelection={handleServiceSelection}
        />
      </div>

      {/* Total Calculation */}
      <div className="mt-4">
        <h4 className="font-bold">Total:</h4>
        <p>${calculateTotal()}</p>
      </div>

      <button
        onClick={handleCreateInvoice}
        className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Create Invoice
      </button>
    </div>
  );
};

export default AddInvoice;
