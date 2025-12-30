import React from "react";

import type { Booking } from "../../types/types";


interface Props {
  bookings: Booking[];
}

const HistoryBookingsTab: React.FC<Props> = ({ bookings }) => {
  const historyBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (!historyBookings.length)
    return <p className="text-gray-600 mt-4">No past bookings available.</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left">Service</th>
            <th className="px-4 py-2 border-b text-left">Provider</th>
            <th className="px-4 py-2 border-b text-left">Date</th>
            <th className="px-4 py-2 border-b text-left">Workers</th>
            <th className="px-4 py-2 border-b text-left">Hours</th>
            <th className="px-4 py-2 border-b text-left">Price</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {historyBookings.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{b.service_name}</td>
              <td className="px-4 py-2 border-b">{b.provider_name}</td>
              <td className="px-4 py-2 border-b">
                {new Date(b.booking_date).toLocaleString()}
              </td>
              <td className="px-4 py-2 border-b">{b.workers_requested}</td>
              <td className="px-4 py-2 border-b">{b.estimated_hours}</td>
              <td className="px-4 py-2 border-b">${b.estimated_price}</td>
              <td className="px-4 py-2 border-b">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    b.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryBookingsTab;
