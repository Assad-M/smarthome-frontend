import { useState, useEffect } from "react";
import api from "../../api/api";
import type { Service, Booking } from "../../types/types";

// Tabs
import ServicesTab from "./ServicesTab";
import BookingsTab from "./BookingsTab";
import HistoryTab from "./HistoryTab";
import AccountTab from "./AccountTab";

const ProviderDashboard: React.FC = () => {
  const [tab, setTab] = useState<"services" | "bookings" | "history" | "account">("services");
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------
  // Refresh functions
  // -------------------
  const refreshServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load services");
    }
  };

  const refreshBookings = async () => {
    try {
      const res = await api.get("/bookings/provider/all");
      const providerId = JSON.parse(localStorage.getItem("user") || "{}").userId;
      setBookings(res.data.data.filter((b: Booking) => b.provider_id === providerId));
    } catch (err) {
      console.error(err);
      alert("Failed to load bookings");
    }
  };

  // -------------------
  // Initial data load
  // -------------------
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          api.get("/services"),
          api.get("/bookings/provider/all"),
        ]);

        const providerId = JSON.parse(localStorage.getItem("user") || "{}").userId;
        setServices(servicesRes.data.data);
        setBookings(bookingsRes.data.data.filter((b: Booking) => b.provider_id === providerId));
      } catch (err) {
        console.error(err);
        alert("Failed to load provider dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // -------------------
  // Logout
  // -------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {[
          ["services", "My Services"],
          ["bookings", "Bookings Received"],
          ["history", "Booking History"],
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
      {tab === "services" && <ServicesTab services={services} refreshServices={refreshServices} />}
      {tab === "bookings" && (
        <BookingsTab bookings={bookings} setBookings={setBookings} refreshBookings={refreshBookings} />
      )}
      {tab === "history" && <HistoryTab bookings={bookings} />}
      {tab === "account" && <AccountTab handleLogout={handleLogout} />}
    </div>
  );
};

export default ProviderDashboard;
