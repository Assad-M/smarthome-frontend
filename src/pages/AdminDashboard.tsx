// ===============================
// src/pages/AdminDashboard.tsx
// ===============================
import { useState } from "react";
import CategoriesTab from "./admin/CategoriesTab";
import ServicesTab from "./admin/ServicesTab";
import BookingsTab from "./admin/BookingsTab";
import UsersTab from "./admin/UsersTab";
import LogsTab from "./admin/LogsTab";

const tabs = [
  { key: "categories", label: "Categories" },
  { key: "services", label: "Services" },
  { key: "bookings", label: "Bookings" },
  { key: "users", label: "Users / Providers" },
  { key: "logs", label: "Login Logs" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <h2 className="text-xl font-bold p-6 border-b">Admin Panel</h2>
        <nav className="flex flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-left hover:bg-gray-200 ${
                activeTab === tab.key ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "logs" && <LogsTab />}
      </main>
    </div>
  );
}
