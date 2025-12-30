import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email: username, // or username based on backend
        password,
      });

      const token = response.data?.token;
      const role = response.data?.user?.role;

      login({ role, token });

      // Redirect based on role or default dashboard
      if (role === "provider") navigate("/provider-dashboard");
      else navigate("/user-dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <input
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button style={{ marginTop: "20px" }} onClick={handleLogin}>
        Login
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}

      <div style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
