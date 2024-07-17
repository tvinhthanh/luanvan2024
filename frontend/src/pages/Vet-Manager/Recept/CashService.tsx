import React from "react";
import { ServiceType } from "../../../../../backend/src/shared/types";

interface ServicesListProps {
  services: ServiceType[];
  selectedServices: string[];
  handleServiceSelection: (serviceId: string) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({ services, selectedServices, handleServiceSelection }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Service</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Select</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service._id}>
            <td className="border px-4 py-2">{service.name}</td>
            <td className="border px-4 py-2">${parseFloat(service.price.toString()).toFixed(2)}</td>
            <td className="border px-4 py-2">
              <input
                type="checkbox"
                value={service._id}
                checked={selectedServices.includes(service._id)}
                onChange={() => handleServiceSelection(service._id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServicesList;
