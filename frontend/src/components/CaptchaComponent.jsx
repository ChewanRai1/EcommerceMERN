import { useState, useEffect } from "react";
import axios from "axios";

export default function CaptchaComponent({ onCaptchaVerified }) {
  const [captchaSvg, setCaptchaSvg] = useState(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/captcha", {
        withCredentials: true,  // Important to allow session cookies
        responseType: "text",
      });
      setCaptchaSvg(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching captcha", err);
      setError("Failed to load CAPTCHA. Please refresh the page.");
    }
  };

  const verifyCaptcha = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/verify-captcha", 
        { captcha: captchaInput },
        { withCredentials: true }  // Include session cookie
      );

      if (response.data.success) {
        onCaptchaVerified(true);
        setError("");
      } else {
        setError("Incorrect CAPTCHA. Please try again.");
        fetchCaptcha(); // Reload CAPTCHA on failure
      }
    } catch (err) {
      console.error("Error verifying captcha", err);
      setError("Error verifying CAPTCHA.");
    }
  };

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: captchaSvg }} />
      <input
        type="text"
        value={captchaInput}
        onChange={(e) => setCaptchaInput(e.target.value)}
        placeholder="Enter CAPTCHA"
        required
      />
      <button type="button" onClick={verifyCaptcha}>
        Verify CAPTCHA
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
