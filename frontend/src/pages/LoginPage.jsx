import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
async function handleLogin(e) {
  e.preventDefault();

  if (email === "" || password === "") {
    setError("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // حفظ الـ token والدور
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    // توجيه حسب الدور
    if (data.role === "Admin") navigate("/admin");
    else if (data.role === "Uploader") navigate("/upload");
    else navigate("/library");
  } catch (err) {
    setError("Server error");
  }
}

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Smart Digital Library</h1>

        <p className="subtitle">
          Login to access the library system
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;
