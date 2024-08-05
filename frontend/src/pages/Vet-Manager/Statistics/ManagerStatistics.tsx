import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { BookingType, InvoiceType, MedicType } from "../../../../../backend/src/shared/types";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StatisticsBookings from "./StatisticsBookings";
import StatisticsMedical from "./StatisticsMedical";
import StatisticsInvoice from "./StatisticsInvoid";
import ChartOne from "./StatisticsSerMed";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsPage: React.FC = () => {
  const { id_vet } = useAppContext();

  // Fetch data for bookings, invoices, and medical records
  const { data: bookings, isLoading: bookingsLoading, error: bookingsError } = useQuery<BookingType[], Error>(
    ["fetchBookingsForVet", id_vet],
    () => apiClient.fetchBookings(id_vet)
  );

  const { data: invoices, isLoading: invoicesLoading, error: invoicesError } = useQuery<InvoiceType[], Error>(
    ["fetchInvoicesForVet", id_vet],
    () => apiClient.fetchInvoicesForVet(id_vet)
  );

  const { data: medicalRecords, isLoading: medicalRecordsLoading, error: medicalRecordsError } = useQuery<MedicType[], Error>(
    ["fetchMedicalRecordsForVet", id_vet],
    () => apiClient.fetchMedicalRecordsByVetId(id_vet)
  );
  
  if (bookingsLoading || invoicesLoading || medicalRecordsLoading) {
    return <div>Loading...</div>;
  }

  if (bookingsError || invoicesError || medicalRecordsError) {
    return <div>Error loading data</div>;
  }

 

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Statistics Overview</h1> */}
      <ChartOne/>
      <StatisticsBookings/>
      <StatisticsInvoice/>
      <StatisticsMedical/>
    </div>
  );
};

export default StatisticsPage;
