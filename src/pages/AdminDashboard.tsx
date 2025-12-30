// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import api from "../api/api";

// --------------------
// Types
// --------------------
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Service {
  id: number;
  provider_name: string;
  name: string;
  description: string;
  price: number;
}

interface Booking {
  id: number;
  user_name: string;
  provider_name: string;
  service_name: string;
  booking_date: string;
  status: string;
}

type SortState = { column: string; order: "asc" | "desc" };

// --------------------
// Component
// --------------------
const AdminDashboard: React.FC = () => {
  // --------------------
  // State
  // --------------------
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Separate loading states
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [servicesLoading, setServicesLoading] = useState<boolean>(false);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  // Filters
  const [userSearch, setUserSearch] = useState<string>("");
  const [serviceSearch, setServiceSearch] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<string>("");

  // Pagination
  const [usersPage, setUsersPage] = useState<number>(1);
  const [usersTotalPages, setUsersTotalPages] = useState<number>(1);
  const [servicesPage, setServicesPage] = useState<number>(1);
  const [servicesTotalPages, setServicesTotalPages] = useState<number>(1);
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState<number>(1);

  // Sorting
  const [usersSort, setUsersSort] = useState<SortState>({ column: "id", order: "asc" });
  const [servicesSort, setServicesSort] = useState<SortState>({ column: "id", order: "asc" });
  const [bookingsSort, setBookingsSort] = useState<SortState>({ column: "id", order: "asc" });

  // --------------------
  // Fetch functions
  // --------------------
  const fetchUsers = async (page: number = usersPage) => {
    try {
      setUsersLoading(true);
      const res = await api.get(
        `/admin/users?page=${page}&limit=10&name=${userSearch}&sortColumn=${usersSort.column}&sortOrder=${usersSort.order}`
      );
      setUsers(res.data.data);
      setUsersPage(res.data.page);
      setUsersTotalPages(res.data.totalPages);
      setUsersLoading(false);
    } catch (err: any) {
      setError(err.message);
      setUsersLoading(false);
    }
  };

  const fetchServices = async (page: number = servicesPage) => {
    try {
      setServicesLoading(true);
      const res = await api.get(
        `/admin/services?page=${page}&limit=10&name=${serviceSearch}&sortColumn=${servicesSort.column}&sortOrder=${servicesSort.order}`
      );
      setServices(res.data.data);
      setServicesPage(res.data.page);
      setServicesTotalPages(res.data.totalPages);
      setServicesLoading(false);
    } catch (err: any) {
      setError(err.message);
      setServicesLoading(false);
    }
  };

  const fetchBookings = async (page: number = bookingsPage) => {
    try {
      setBookingsLoading(true);
      const res = await api.get(
        `/admin/bookings?page=${page}&limit=10&status=${bookingStatus}&sortColumn=${bookingsSort.column}&sortOrder=${bookingsSort.order}`
      );
      setBookings(res.data.data);
      setBookingsPage(res.data.page);
      setBookingsTotalPages(res.data.totalPages);
      setBookingsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setBookingsLoading(false);
    }
  };

  // --------------------
  // Effects
  // --------------------
  useEffect(() => {
    fetchUsers(1);
  }, [userSearch, usersSort]);

  useEffect(() => {
    fetchServices(1);
  }, [serviceSearch, servicesSort]);

  useEffect(() => {
    fetchBookings(1);
  }, [bookingStatus, bookingsSort]);

  useEffect(() => {
    fetchUsers(usersPage);
  }, [usersPage]);

  useEffect(() => {
    fetchServices(servicesPage);
  }, [servicesPage]);

  useEffect(() => {
    fetchBookings(bookingsPage);
  }, [bookingsPage]);

  // --------------------
  // Handlers
  // --------------------
  const handleDelete = async (type: "users" | "services" | "bookings", id: number) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      if (type === "users") fetchUsers(usersPage);
      if (type === "services") fetchServices(servicesPage);
      if (type === "bookings") fetchBookings(bookingsPage);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const renderPagination = (page: number, totalPages: number, setPage: (p: number) => void) => (
    <div className="flex justify-center space-x-2 mt-2">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`px-3 py-1 border rounded ${p === page ? "bg-blue-500 text-white" : ""}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );

  const tableHeaders = (
    columns: { key: string; label: string }[],
    sortState: SortState,
    setSortState: React.Dispatch<React.SetStateAction<SortState>>
  ) =>
    columns.map((col) => (
      <th
        key={col.key}
        className="text-left px-4 py-2 border-b cursor-pointer select-none"
        onClick={() =>
          setSortState({
            column: col.key,
            order: sortState.column === col.key && sortState.order === "asc" ? "desc" : "asc",
          })
        }
      >
        {col.label} {sortState.column === col.key ? (sortState.order === "asc" ? "▲" : "▼") : ""}
      </th>
    ));

  // --------------------
  // Render
  // --------------------
  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Users */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full max-w-sm"
        />
        {usersLoading ? (
          <p className="text-center mt-2">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders(
                    [
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "role", label: "Role" },
                      { key: "created_at", label: "Created At" },
                      { key: "actions", label: "Actions" },
                    ],
                    usersSort,
                    setUsersSort
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{u.id}</td>
                    <td className="px-4 py-2 border-b">{u.name}</td>
                    <td className="px-4 py-2 border-b">{u.email}</td>
                    <td className="px-4 py-2 border-b">{u.role}</td>
                    <td className="px-4 py-2 border-b">{new Date(u.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete("users", u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(usersPage, usersTotalPages, setUsersPage)}
          </div>
        )}
      </section>

      {/* Services */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Services</h2>
        <input
          type="text"
          placeholder="Search services..."
          value={serviceSearch}
          onChange={(e) => setServiceSearch(e.target.value)}
          className="border rounded px-2 py-1 mb-2 w-full max-w-sm"
        />
        {servicesLoading ? (
          <p className="text-center mt-2">Loading services...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders(
                    [
                      { key: "id", label: "ID" },
                      { key: "provider_name", label: "Provider" },
                      { key: "name", label: "Name" },
                      { key: "description", label: "Description" },
                      { key: "price", label: "Price" },
                      { key: "actions", label: "Actions" },
                    ],
                    servicesSort,
                    setServicesSort
                  )}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{s.id}</td>
                    <td className="px-4 py-2 border-b">{s.provider_name}</td>
                    <td className="px-4 py-2 border-b">{s.name}</td>
                    <td className="px-4 py-2 border-b">{s.description}</td>
                    <td className="px-4 py-2 border-b">{s.price}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete("services", s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(servicesPage, servicesTotalPages, setServicesPage)}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <select
          value={bookingStatus}
          onChange={(e) => setBookingStatus(e.target.value)}
          className="border rounded px-2 py-1 mb-2"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {bookingsLoading ? (
          <p className="text-center mt-2">Loading bookings...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  {tableHeaders(
                    [
                      { key: "id", label: "ID" },
                      { key: "user_name", label: "User" },
                      { key: "provider_name", label: "Provider" },
                      { key: "service_name", label: "Service" },
                      { key: "booking_date", label: "Booking Date" },
                      { key: "status", label: "Status" },
                      { key: "actions", label: "Actions" },
                    ],
                    bookingsSort,
                    setBookingsSort
                  )}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{b.id}</td>
                    <td className="px-4 py-2 border-b">{b.user_name}</td>
                    <td className="px-4 py-2 border-b">{b.provider_name}</td>
                    <td className="px-4 py-2 border-b">{b.service_name}</td>
                    <td className="px-4 py-2 border-b">{new Date(b.booking_date).toLocaleString()}</td>
                    <td className="px-4 py-2 border-b">{b.status}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete("bookings", b.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination(bookingsPage, bookingsTotalPages, setBookingsPage)}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
