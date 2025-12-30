import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 
const handleLogin = async () => {
  try {
    // Send "email" (not "username")
    const response = await api.post("/auth/login", {
      email: username, // or rename your state to "email" to avoid confusion
      password,
    });

    // Read token and role correctly based on your backend response
    const token = response.data?.token;
    const role = response.data?.user?.role;

    // If your login context expects { role, token }:
    login({ role, token });
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <input
        placeholder="Username"
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
      
      <br />
      <button style={{ marginTop: "20px" }} onClick={handleLogin}>
        Login
      </button>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default Login;
