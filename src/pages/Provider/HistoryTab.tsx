import type { Booking } from "../../types/types";

interface Props {
  bookings: Booking[];
}

const HistoryTab: React.FC<Props> = ({ bookings }) => {
  const historyBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  if (!historyBookings.length) return <p>No history yet.</p>;

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Service</th>
          <th className="p-2">User</th>
          <th className="p-2">Date</th>
          <th className="p-2">Workers</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {historyBookings.map((b) => (
          <tr key={b.id} className="border-t">
            <td className="p-2">{b.service_name}</td>
            <td className="p-2">{b.customer_name || b.user_id}</td>
            <td className="p-2">{new Date(b.booking_date).toLocaleString()}</td>
            <td className="p-2">{b.workers_requested}</td>
            <td className="p-2">{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTab;
