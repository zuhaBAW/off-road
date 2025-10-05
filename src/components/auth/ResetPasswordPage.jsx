
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./reset-password.css";

const API_BASE = "https://positive-health-719181f708.strapiapp.com/";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get("code");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    setMsg({ type: "", text: "" });
  }, [password, confirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code)
      return setMsg({
        type: "error",
        text: "Reset code missing. Open the email link again.",
      });
    if (!password || password.length < 8)
      return setMsg({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
    if (password !== confirm)
      return setMsg({ type: "error", text: "Passwords do not match." });

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, passwordConfirmation: confirm, code }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.error?.message || "Failed to reset password.");

      setMsg({
        type: "success",
        text: "Password updated! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rp-wrap">
      <div className="rp-card">
        <header className="rp-head">
          <h1 className="rp-title">Reset your password</h1>
          <p className="rp-sub">
            {/* Create a strong new password to secure your account. */}
          </p>
        </header>

        {!code && (
          <div className="rp-alert rp-alert-error">
            No reset code found in the URL. Open the link from your email again.
          </div>
        )}

        <form className="rp-form" onSubmit={handleSubmit}>
          <label className="rp-label" htmlFor="newPass">
            New password
          </label>
          <input
            id="newPass"
            className="rp-input"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <label className="rp-label" htmlFor="confirmPass">
            Confirm password
          </label>
          <input
            id="confirmPass"
            className="rp-input"
            type="password"
            placeholder="Re-enter new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />

          {msg.text && (
            <div
              className={`rp-alert ${
                msg.type === "error" ? "rp-alert-error" : "rp-alert-ok"
              }`}
            >
              {msg.text}
            </div>
          )}

          <button type="submit" className="rp-btn" disabled={loading || !code}>
            {loading ? "Updating…" : "Set new password"}
          </button>
        </form>

        <footer className="rp-foot">
          <a href="/login" className="rp-link">
            Back to login
          </a>
        </footer>
      </div>
    </section>
  );
}
