import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./User/UserDashboard";
import ProviderDashboard from "./Provider/ProviderDashboard";

const DashboardRouter = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "user") return <UserDashboard />;
  if (user.role === "provider") return <ProviderDashboard />;

  return <Navigate to="/login" replace />;
};

export default DashboardRouter;
