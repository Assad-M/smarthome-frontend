import { useState } from "react";
import api from "../../api/api";

const AccountTab = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      // Use response to set feedback
      if (res.data?.success) {
        setMessage("Password changed successfully");
        // Optionally clear input fields
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(res.data?.message || "Failed to change password");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error changing password");
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <input
        type="password"
        placeholder="Old password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      <button onClick={handleChangePassword}>Change Password</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default AccountTab;
