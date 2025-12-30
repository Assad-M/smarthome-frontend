// src/components/ProviderBookingRow.tsx
import React, { useState } from "react";
import api from "../api/api";

// Optional TypeScript interface
interface Booking {
  id: number;
  service_name: string;
  customer_name: string;
  booking_date: string;
  status: string;
}

interface Props {
  booking: Booking;                 // The booking row data
  onUpdate: (updatedBooking: Booking) => void; // Callback to update parent table
}

const ProviderBookingRow: React.FC<Props> = ({ booking, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "accept" | "reject" | "start" | "complete") => {
    try {
      setLoading(true);
      const res = await api.patch(`/provider/${booking.id}/${action}`);
      onUpdate(res.data.booking); // Update parent table row
    } catch (err) {
      console.error("Action error:", err);
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr>
      <td>{booking.service_name}</td>
      <td>{booking.customer_name}</td>
      <td>{new Date(booking.booking_date).toLocaleString()}</td>
      <td>{booking.status}</td>
      <td>
        {booking.status === "pending" && (
          <>
            <button onClick={() => handleAction("accept")} disabled={loading}>
              Accept
            </button>
            <button onClick={() => handleAction("reject")} disabled={loading}>
              Reject
            </button>
          </>
        )}
        {booking.status === "accepted" && (
          <button onClick={() => handleAction("start")} disabled={loading}>
            Start
          </button>
        )}
        {booking.status === "in-progress" && (
          <button onClick={() => handleAction("complete")} disabled={loading}>
            Complete
          </button>
        )}
      </td>
    </tr>
  );
};

export default ProviderBookingRow;
