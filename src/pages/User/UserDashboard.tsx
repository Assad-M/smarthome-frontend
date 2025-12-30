import { useEffect, useState } from "react";
import api from "../../api/api";
import type { Service, Booking } from "../../types/types"; // correct path to types.tsx

import AvailableServicesTab from "./AvailableServicesTab";
import ActiveBookingsTab from "./ActiveBookingsTab";
import HistoryBookingsTab from "./HistoryBookingsTab";
import AccountTab from "./AccountTab";


const UserDashboard: React.FC = () => {
  const [tab, setTab] = useState<"services" | "active" | "history" | "account">("services");

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* Booking modal state */
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [workers, setWorkers] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          api.get("/services"),
          api.get("/bookings"),
        ]);

        setServices(servicesRes.data.data);
        setBookings(bookingsRes.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const estimateHours = (service: Service, workersCount: number) => Math.max(1, Math.ceil(service.base_hours / workersCount));
  const estimatePrice = (service: Service, workersCount: number) => estimateHours(service, workersCount) * workersCount * service.price;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const confirmBooking = async () => {
    if (!selectedService || !bookingDate) return;
    const finalWorkers = Math.min(workers, selectedService.max_workers);
    const estimated_hours = estimateHours(selectedService, finalWorkers);
    const estimated_price = estimatePrice(selectedService, finalWorkers);

    try {
      const res = await api.post("/bookings", {
        service_id: selectedService.id,
        booking_date: bookingDate,
        workers_requested: finalWorkers,
      });

      setBookings((prev) => [
        {
          ...res.data.booking,
          service_name: selectedService.name,
          provider_name: selectedService.provider_name,
          estimated_hours,
          estimated_price,
          workers_requested: finalWorkers,
        },
        ...prev,
      ]);

      setSelectedService(null);
      setBookingDate("");
      setWorkers(1);
      alert("Booking created successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {[
          ["services", "Available Services"],
          ["active", "My Bookings"],
          ["history", "History"],
          ["account", "Account"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-3 py-2 ${tab === key ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Render Tabs */}
      {tab === "services" && (
        <AvailableServicesTab
          services={services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          workers={workers}
          setWorkers={setWorkers}
          estimateHours={estimateHours}
          estimatePrice={estimatePrice}
          confirmBooking={confirmBooking}
        />
      )}
      {tab === "active" && <ActiveBookingsTab bookings={bookings.filter(b => b.status !== "completed" && b.status !== "cancelled")} />}
      {tab === "history" && <HistoryBookingsTab bookings={bookings.filter(b => b.status === "completed" || b.status === "cancelled")} />}
      {tab === "account" && <AccountTab handleLogout={handleLogout} />}
    </div>
  );
};

export default UserDashboard;
