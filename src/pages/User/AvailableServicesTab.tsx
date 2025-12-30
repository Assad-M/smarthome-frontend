import { useState } from "react";
import type  { Service } from "../../types/types";

interface Props {
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  workers: number;
  setWorkers: (n: number) => void;
  estimateHours: (service: Service, workers: number) => number;
  estimatePrice: (service: Service, workers: number) => number;
  confirmBooking: () => Promise<void>;
}

const AvailableServicesTab: React.FC<Props> = ({
  services,
  
  setSelectedService,

}) => {
  // --------------------
  // Filters state
  // --------------------
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    provider: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // --------------------
  // Filtered services
  // --------------------
  const filteredServices = services.filter((s) => {
    return (
      (!filters.name || s.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.category || s.category_name.toLowerCase().includes(filters.category.toLowerCase())) &&
      (!filters.provider || s.provider_name.toLowerCase().includes(filters.provider.toLowerCase())) &&
      (!filters.minPrice || s.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || s.price <= Number(filters.maxPrice))
    );
  });

  return (
    <div>
      {/* -------------------- */}
      {/* Filters Row */}
      {/* -------------------- */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        <input
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Service"
          className="border p-1"
        />
        <input
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          placeholder="Category"
          className="border p-1"
        />
        <input
          name="provider"
          value={filters.provider}
          onChange={handleFilterChange}
          placeholder="Provider"
          className="border p-1"
        />
        <div className="flex gap-1">
          <input
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min"
            className="border p-1 w-1/2"
          />
          <input
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max"
            className="border p-1 w-1/2"
          />
        </div>
        <div /> {/* Base hours column */}
        <div /> {/* Max workers column */}
        <div /> {/* Action column */}
      </div>

      {/* -------------------- */}
      {/* Services Table */}
      {/* -------------------- */}
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Service</th>
            <th className="p-2">Category</th>
            <th className="p-2">Provider</th>
            <th className="p-2">Base Hours</th>
            <th className="p-2">Price</th>
            <th className="p-2">Max Workers</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.category_name}</td>
              <td className="p-2">{s.provider_name}</td>
              <td className="p-2">{s.base_hours}</td>
              <td className="p-2">${s.price}</td>
              <td className="p-2">{s.max_workers}</td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedService(s)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableServicesTab;
