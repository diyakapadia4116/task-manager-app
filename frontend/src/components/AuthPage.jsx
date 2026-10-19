import { useState } from "react";
import * as authApi from "../api/authApi";

export default function AuthPage({ onAuthSuccess, pushLog }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        const res = await authApi.login({ email, password });
        if (pushLog) pushLog("POST", "/api/auth/login");
        onAuthSuccess(res.data);
      } else {
        const res = await authApi.register({ name, email, password });
        if (pushLog) pushLog("POST", "/api/auth/register");
        onAuthSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h2>{isLogin ? "Welcome Back to Nook" : "Create your Nook Account"}</h2>
          <p className="auth-card__subtitle">
            {isLogin
              ? "Sign in to manage your tasks securely"
              : "Register to get started with your cozy workspace"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tabs__tab ${isLogin ? "auth-tabs__tab--active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tabs__tab ${!isLogin ? "auth-tabs__tab--active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {error && <div className="banner banner--error auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Diya Kapadiya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Processing..." : isLogin ? "Sign In →" : "Create Account →"}
          </button>
        </form>
      </div>
    </div>
  );
}
