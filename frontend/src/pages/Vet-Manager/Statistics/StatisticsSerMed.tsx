import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import * as apiClient from "../../../api-client"; // Ensure the path is correct
import { useAppContext } from "../../../contexts/AppContext";

// ApexCharts configuration
const baseOptions: ApexOptions = {
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
    min: 0, // Default min value
    max: 1000, // Default max value
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
  const [chartType, setChartType] = useState<'service' | 'medications'>('service');
  const [state, setState] = useState<{ series: { name: string; data: number[]; colName: string[] }[] }>({
    series: [
      { name: "Số lần sử dụng", data: [], colName: [] },
      { name: "Số lần sử dụng", data: [], colName: [] }
    ],
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [yAxisOptions, setYAxisOptions] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const { id_vet } = useAppContext();

  const fetchChartData = async () => {
    try {
      const serviceData = await apiClient.fetchServiceChart(id_vet);
      const medicationData = await apiClient.fetchMedicationChart(id_vet);

      const serviceNames = serviceData.map((service: ServiceType) => service.name);
      const serviceTimes = serviceData.map((service: ServiceType) => service.time);

      const medicationNames = medicationData.map((medication: MedicationType) => medication.name);
      const medicationTimes = medicationData.map((medication: MedicationType) => medication.time);

      const allCategories = chartType === 'service'
        ? serviceNames
        : medicationNames;

      const serviceDataMapped = chartType === 'service'
        ? serviceNames.map(cat => serviceTimes[serviceNames.indexOf(cat)] || 0)
        : [];

      const medicationDataMapped = chartType === 'medications'
        ? medicationNames.map(cat => medicationTimes[medicationNames.indexOf(cat)] || 0)
        : [];

      // Determine the min and max values for the y-axis
      const allData = chartType === 'service' ? serviceDataMapped : medicationDataMapped;
      const minValue = Math.min(...allData, 0);
      const maxValue = Math.max(...allData, 200); // Default max is used if no data is available

      setCategories(allCategories);
      setState({
        series: [
          {
            name: "Số lần sử dụng",
            data: serviceDataMapped,
            colName: serviceNames
          },
          {
            name: "Số lần sử dụng",
            data: medicationDataMapped,
            colName: medicationNames
          }
        ],
      });

      setYAxisOptions({
        min: minValue,
        max: maxValue,
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [id_vet, chartType]);

  const filteredSeries = () => {
    switch (chartType) {
      case 'service':
        return [
          { name: "Số lần sử dụng", data: state.series[0].data }
        ];
      case 'medications':
        return [
          { name: "Số lần sử dụng", data: state.series[1].data }
        ];
      default:
        return [];
    }
  };

  const changeChartType = (name: 'service' | 'medications') => {
    setChartType(name);
    if (name === 'service') {
      setCategories(state.series[0].colName);
    } else if (name === 'medications') {
      setCategories(state.series[1].colName);
    }
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${chartType === 'service' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeChartType('service')}
        >
          Dịch vụ
        </button>
        <button
          className={`px-4 py-2 rounded-md ${chartType === 'medications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeChartType('medications')}
        >
          Thuốc
        </button>
      </div>

      <div>
        <ReactApexChart
          options={{
            ...baseOptions,
            xaxis: {
              ...baseOptions.xaxis,
              categories: categories,
            },
            yaxis: {
              ...baseOptions.yaxis,
              min: yAxisOptions.min,
              max: yAxisOptions.max,
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
