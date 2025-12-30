import type { Booking } from "../../types/types";
import api from "../../api/api";

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  refreshBookings: () => Promise<void>;
}

const BookingsTab: React.FC<Props> = ({ bookings, setBookings, refreshBookings }) => {

  // Generic function to update booking status
  const updateStatus = async (id: number, status: string) => {
    try {
      if (status === "accepted") await api.patch(`/bookings/provider/${id}/accept`);
      else if (status === "in-progress") await api.patch(`/bookings/provider/${id}/start`);
      else if (status === "completed") await api.patch(`/bookings/provider/${id}/complete`);
      else if (status === "cancelled") await api.patch(`/bookings/provider/${id}/cancel`); // optional

      await refreshBookings(); // refresh table after update
      alert(`Booking ${status}`);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update booking");
    }
  };

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Service</th>
          <th className="p-2">User</th>
          <th className="p-2">Date</th>
          <th className="p-2">Workers</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id} className="border-t">
            <td className="p-2">{b.service_name}</td>
            <td className="p-2">{b.customer_name}</td>
            <td className="p-2">{new Date(b.booking_date).toLocaleString()}</td>
            <td className="p-2">{b.workers_requested}</td>
            <td className="p-2">{b.status}</td>
            <td className="p-2 flex gap-1">
              {b.status === "pending" && (
                <button
                  onClick={() => updateStatus(b.id, "accepted")}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Accept
                </button>
              )}
              {b.status === "accepted" && (
                <button
                  onClick={() => updateStatus(b.id, "in-progress")}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Start
                </button>
              )}
              {b.status === "in-progress" && (
                <button
                  onClick={() => updateStatus(b.id, "completed")}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Complete
                </button>
              )}
              {b.status !== "completed" && b.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus(b.id, "cancelled")}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookingsTab;
