import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
console.log("Register response:", response.data);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error(err.response || err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Register</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="provider">Provider</option>
      </select>
      <br />
      <button style={{ marginTop: "20px" }} onClick={handleRegister}>
        Register
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
    </div>
  );
};

export default Register;
