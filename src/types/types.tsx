// src/types.ts

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  base_hours: number;
  max_workers: number;
  provider_name: string;
  category_name: string;
}

// src/types/types.tsx

export interface Booking {
  id: number;
  service_id: number;
  service_name: string;
  user_id: number;
  customer_name?: string;       // optional if you join user table
  provider_id: number;      // needed for ProviderDashboard
  provider_name?: string;   // optional
  booking_date: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  workers_requested: number;
  estimated_hours: number | null;
  estimated_price: number | null;
  booking_details?: any;
  accepted_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface Category {
  id: number;
  name: string;
}
