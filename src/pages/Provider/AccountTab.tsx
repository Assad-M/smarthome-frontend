import { useState } from "react";
import api from "../../api/api";

interface Props {
  handleLogout: () => void;
}

const AccountTab: React.FC<Props> = ({ handleLogout }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data?.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Account Settings</h2>

      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Change Password</button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <hr style={{ margin: "20px 0" }} />
      <button onClick={handleLogout} style={{ backgroundColor: "#f00", color: "#fff" }}>
        Logout
      </button>
    </div>
  );
};

export default AccountTab;
