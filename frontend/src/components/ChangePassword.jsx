import { useState } from "react";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("resetToken"); // ✅ Retrieve Token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send Token in Header
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error changing password.");
      console.error("❌ Change Password Error:", error);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ChangePassword;
