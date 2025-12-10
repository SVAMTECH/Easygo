import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Register({ setCurrentPage }) {
  const { register } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => setCurrentPage("login"), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          placeholder="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-full">
          Register
        </button>
      </form>

      <p>
        Already registered?{" "}
        <span className="link" onClick={() => setCurrentPage("login")}>
          Login here
        </span>
      </p>
    </div>
  );
}
