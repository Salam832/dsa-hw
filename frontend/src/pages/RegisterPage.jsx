import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Reader");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(e) {
  e.preventDefault();

  if (!fullName || !email || !role || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("https://dsa-hw.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Account created successfully!");
    navigate("/");
  } catch (err) {
    alert("Server error");
  }
}

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p className="register-subtitle">Join the Smart Digital Library</p>

        <form onSubmit={handleRegister}>
          <div className="register-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="register-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Reader">Reader</option>
              <option value="Uploader">Uploader</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="register-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="register-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="register-button" type="submit">
            Create Account
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;