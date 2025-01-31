import { useState } from "react";
// import { useState } from "react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ newPassword: newPassword }),
        }
      );

      const data = await response.json();

      console.log(response);
      console.log(data);
      if (!response.ok) {
        setError(data.message || "Error resetting password.");
      } else {
        setSuccess("Password reset successfully.");
        setError("");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred while resetting the password.");
    }
  };

  // export default function ResetPassword() {
  //   const [newPassword, setNewPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [error, setError] = useState("");
  //   const [success, setSuccess] = useState("");
  //   const [csrfToken, setCsrfToken] = useState("");

  // // ✅ Fetch CSRF token on component mount
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
  //     method: "GET",
  //     credentials: "include",
  //   })
  //     .then((res) => res.json())
  //     // .then(() => {
  //     //   setCsrfToken(
  //     //     document.cookie
  //     //       .split("; ")
  //     //       .find((row) => row.startsWith("XSRF-TOKEN"))
  //     //       ?.split("=")[1]
  //     //   );
  //     // });
  //     .then((data) => {
  //       setCsrfToken(data.csrfToken); // ✅ Fetch CSRF token correctly
  //     });
  // }, []);
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
  //     method: "GET",
  //     credentials: "include", // ✅ Ensures cookies are included
  //   })
  //     .then((res) => {
  //       console.log("Response received:", res); // ✅ Debug response
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       return res.json(); // ✅ Ensure JSON response
  //     })
  //     .then((data) => {
  //       console.log("Parsed data:", data); // ✅ Debugging

  //       // ✅ First, try extracting from cookies
  //       let token = document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("XSRF-TOKEN"))
  //         ?.split("=")[1];

  //       // ✅ If the cookie is missing, fallback to JSON response
  //       if (!token && data.csrfToken) {
  //         token = data.csrfToken;
  //       }

  //       if (token) {
  //         setCsrfToken(token);
  //       } else {
  //         console.error("CSRF token not found in cookies or response");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching CSRF token:", error);
  //     });
  // }, []);
  // // ✅ Fetch CSRF Token on Component Mount
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
  //     method: "GET",
  //     credentials: "include", // Ensure cookies are sent
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! Status: ${res.status}`);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log("Parsed CSRF Token:", data);
  //       setCsrfToken(data.csrfToken); // ✅ Store CSRF token in state
  //     })
  //     .catch((error) => console.error("Error fetching CSRF token:", error));
  // }, []);

  // // ✅ Handle Password Reset Submission
  // const handlePasswordReset = async (e) => {
  //   e.preventDefault();

  //   if (!csrfToken) {
  //     setError("CSRF token is missing.");
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/users/reset-password`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "X-XSRF-TOKEN": csrfToken, // ✅ Ensure CSRF token is sent
  //         },
  //         body: JSON.stringify({ newPassword }),
  //         credentials: "include", // ✅ Ensure cookies are included
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       setError(data.message || "Error resetting password.");
  //     } else {
  //       setSuccess("Password reset successfully.");
  //       setError("");
  //     }
  //   } catch {
  //     setError("An error occurred while resetting the password.");
  //   }
  // };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handlePasswordReset}>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Reset Password
        </button>
      </form>
    </div>
  );
}
