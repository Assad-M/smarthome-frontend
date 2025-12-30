// src/pages/Register.tsx
import { useState } from "react";
import api from "../api/api"; // your axios instance
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", { username, email, password, role });
      navigate("/login"); // redirect after successful registration
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: "5px 0", padding: "5px", width: "200px" }}
      />
      <br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "5px 0", padding: "5px", width: "200px" }}
      />
      <br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "5px 0", padding: "5px", width: "200px" }}
      />
      <br />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ margin: "5px 0", padding: "5px", width: "210px" }}
      >
        <option value="user">User</option>
        <option value="provider">Provider</option>
      </select>
      <br />

      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "8px 20px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
      )}

      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
