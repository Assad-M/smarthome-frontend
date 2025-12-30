import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth is resolved
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // If logged in, redirect based on role
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "user") return <Navigate to="/user" replace />;
    if (user.role === "provider") return <Navigate to="/provider" replace />;
  }

  return children;
};

export default PublicRoute;
