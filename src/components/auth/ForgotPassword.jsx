import React, { useState } from "react";
import { forgotPassword } from "../../api/forgotPassword";
import "./forgot.css";

export default function ForgotPasswordModal({
  open,
  onClose,
  defaultEmail = "",
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email.trim()) {
      setMsg({ type: "error", text: "Please enter your email." });
      return;
    }

    try {
      setSubmitting(true);
      await forgotPassword(email.trim());
      setMsg({
        type: "success",
        text: "If an account exists for that email, a reset link has been sent.",
      });
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.message || "Unable to request password reset.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fp-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fp-title"
    >
      <div className="fp-modal">
        <button className="fp-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h3 id="fp-title" className="fp-title">
          Forgot Password
        </h3>
        <p className="fp-sub">Enter your email to receive a reset link.</p>

        {msg.text && (
          <div
            className={`fp-alert ${
              msg.type === "error" ? "fp-alert-error" : "fp-alert-success"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="fp-label">
            Email
            <input
              className="fp-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              placeholder="you@example.com"
              required
            />
          </label>

          <button className="fp-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
