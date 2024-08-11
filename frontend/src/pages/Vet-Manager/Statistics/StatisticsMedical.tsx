import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { MedicType } from "../../../../../backend/src/shared/types";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsMedical: React.FC = () => {
  const { id_vet } = useAppContext();

  // Fetch the medical records for a specific vet
  const { data: medicalRecords, isLoading, error } = useQuery<MedicType[], Error>(
    ["fetchMedicalRecordsForVet", id_vet],
    () => apiClient.fetchMedicalRecordsByVetId(id_vet) // Ensure you have this function in your apiClient
  );

  // Aggregate medical records by date
  const aggregateMedicalRecordsByDate = (records: MedicType[]) => {
    return records.reduce((acc, record) => {
      const date = new Date(record.visitDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const aggregatedRecords = medicalRecords ? aggregateMedicalRecordsByDate(medicalRecords) : {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading medical records: {error.message}</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(aggregatedRecords), // Dates
    datasets: [
      {
        label: 'Number of Medical Records',
        data: Object.values(aggregatedRecords), // Number of records
        fill: false,
        borderColor: '#1E90FF', // Color for the line
        tension: 0.1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Show count
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Records'
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thống kế số lượng phiếu khám</h1>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatisticsMedical;
