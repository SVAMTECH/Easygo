import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Login({ setCurrentPage }) {
  const { login } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);
    if (result.success) {
      setCurrentPage("dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <h2>Login</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary btn-full">
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <span className="link" onClick={() => setCurrentPage("register")}>
          Register here
        </span>
      </p>
    </div>
  );
}
