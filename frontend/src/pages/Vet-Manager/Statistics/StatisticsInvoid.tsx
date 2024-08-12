import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { InvoiceType } from "../../../../../backend/src/shared/types";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsInvoice: React.FC = () => {
  const { id_vet } = useAppContext();

  // Fetch the invoices for a specific vet
  const { data: invoices, isLoading, error } = useQuery<InvoiceType[], Error>(
    ["fetchInvoicesForVet", id_vet],
    () => apiClient.fetchInvoicesForVet(id_vet) // Ensure you have this function in your apiClient
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading invoices: {error.message}</div>;
  }
  // Aggregate invoices by date
  const aggregateInvoicesByDate = (invoices: InvoiceType[]) => {
    return invoices.reduce((acc, invoice) => {
      const date = new Date(invoice.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const aggregatedInvoices = invoices ? aggregateInvoicesByDate(invoices) : {};

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(aggregatedInvoices), // Dates
    datasets: [
      {
        label: 'Number of Invoices',
        data: Object.values(aggregatedInvoices), // Number of invoices
        fill: false,
        borderColor: '#FF5733', // Color for the line
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
          text: 'Number of Invoices'
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thống kê Hoá đơn</h1>
      <div className="chart-container" style={{ width: '100%', height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatisticsInvoice;
