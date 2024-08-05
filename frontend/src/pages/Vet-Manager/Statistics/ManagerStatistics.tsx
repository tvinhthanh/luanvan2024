import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import * as apiClient from "../../../api-client"; // Ensure the path is correct
import { useAppContext } from "../../../contexts/AppContext";

// ApexCharts configuration
const options: ApexOptions = {
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#FF4560"], // Different colors for services and medications
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "bar",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2],
    curve: "smooth",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [], // Will be updated with service and medication names
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 1000, // Adjust based on expected maximum values
  },
};

// Define interfaces for service and medication data
export interface ServiceType {
  name: string;
  time: number;
}

export interface MedicationType {
  name: string;
  time: number;
}

const ChartOne: React.FC = () => {
  const [chartType, setChartType] = useState<'both' | 'service' | 'medications'>('both');
  const [state, setState] = useState<{ series: { name: string; data: number[]; colName: string[] }[] }>({
    series: [
      { name: "Service Time", data: [], colName: [] },
      { name: "Medication time", data: [], colName: [] }
    ],
  });
  const [categories, setCategories] = useState<string[]>([]);
  const { id_vet } = useAppContext();

  const fetchChartData = async () => {
    try {
      const serviceData = await apiClient.fetchServiceChart(id_vet);
      const medicationData = await apiClient.fetchMedicationChart(id_vet);

      console.log('Service Data:', serviceData);
      console.log('Medication Data:', medicationData);

      const serviceNames = serviceData.map((service: ServiceType) => service.name);
      const serviceTimes = serviceData.map((service: ServiceType) => service.time);

      const medicationNames = medicationData.map((medication: MedicationType) => medication.name);
      const medicationtimes = medicationData.map((medication: MedicationType) => medication.time);

      // Combine and deduplicate categories
      const allCategories = Array.from(new Set([...serviceNames, ...medicationNames]));

      const serviceDataMapped = allCategories.map(cat => serviceTimes[serviceNames.indexOf(cat)] || 0);
      const medicationDataMapped = allCategories.map(cat => medicationtimes[medicationNames.indexOf(cat)] || 0);

      console.log('All Categories:', allCategories);
      console.log('Service Data Mapped:', serviceDataMapped);
      console.log('Medication Data Mapped:', medicationDataMapped);

      setCategories(allCategories);
      setState({
        series: [
          {
            name: "Service Time",
            data: serviceDataMapped,
            colName: serviceNames

          },
          {
            name: "Medication time",
            data: medicationDataMapped,
            colName: medicationNames
          }
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const filteredSeries = () => {
    switch (chartType) {
      case 'service':
        return [
          { name: "Service Time", data: state.series[0].data }
        ];
      case 'medications':
        return [
          { name: "Medication time", data: state.series[1].data }
        ];
      case 'both':
        return [
          { name: "both", data: [...state.series[0].data, ...state.series[1].data] }
        ];
      default:
        return state.series;
    }
  };

  const changeChartType = (name: any) => {
    setChartType(name);
    switch(name){
      case 'service':
        setCategories(state.series[0].colName);
        break;
      case 'medications': 
        setCategories(state.series[1].colName);
        break;
      case 'both':
        setCategories([...state.series[0].colName, ...state.series[1].colName]);
        break;
    }

  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${chartType === 'service' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeChartType('service')}
        >
          Service
        </button>
        <button
          className={`px-4 py-2 rounded-md ${chartType === 'medications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeChartType('medications')}
        >
          Medications
        </button>
        <button
          className={`px-4 py-2 rounded-md ${chartType === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeChartType('both')}
        >
          Both
        </button>
      </div>

      <div>
        <ReactApexChart
          options={{
            ...options,
            xaxis: {
              ...options.xaxis,
              categories: categories,
            },
          }}
          series={filteredSeries()}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ChartOne;
