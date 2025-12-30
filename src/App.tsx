import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Login from "./pages/Login";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from "./pages/User/UserDashboard";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";
import Register from "./pages/Register";



import 'react-toastify/dist/ReactToastify.css';

// Dashboards (names can stay)

const Unauthorized = () => <div>Unauthorized Access</div>;

const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "user") return <Navigate to="/user" replace />;
  if (user.role === "provider") return <Navigate to="/provider" replace />;

  return <Navigate to="/unauthorized" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Root */}
          <Route path="/" element={<RootRedirect />} />
        <Route path="/register" element={<Register />} />

          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* User */}
          <Route
            path="/user"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Provider */}
          <Route
            path="/provider"
            element={
              <PrivateRoute allowedRoles={["provider"]}>
                <ProviderDashboard />
              </PrivateRoute>
            }
          />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
