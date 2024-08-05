import React from "react";
import { useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { useAppContext } from "../../../contexts/AppContext";
import { BookingType } from "../../../../../backend/src/shared/types";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsBookings: React.FC = () => {
  const { id_vet } = useAppContext();

  // Fetch the bookings for a specific vet
  const { data: bookings, isLoading, error } = useQuery<BookingType[], Error>(
    ["fetchBookingsForVet", id_vet],
    () => apiClient.fetchBookings(id_vet)
  );

  // Aggregate bookings by date
  const aggregateBookingsByDate = (bookings: BookingType[]) => {
    return bookings.reduce((acc, booking) => {
      const date = new Date(booking.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const aggregatedBookings = bookings ? aggregateBookingsByDate(bookings) : {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(aggregatedBookings), // Dates
    datasets: [
      {
        label: 'Number of Bookings',
        data: Object.values(aggregatedBookings), // Booking counts
        fill: false,
        borderColor: '#4CAF50',
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
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
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
          text: 'Number of Bookings'
        }
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Statistics</h1>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatisticsBookings;
