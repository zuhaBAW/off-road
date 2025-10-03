import React, { useMemo, useState } from "react";

const API_URL = "http://localhost:1337/api/auth/reset-password";

export default function ResetPasswordPage() {
  // read ?code=... from the URL
  const code = useMemo(
    () => new URLSearchParams(window.location.search).get("code") || "",
    []
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!code) {
      setMsg({
        type: "error",
        text: "Missing reset code. Please use the link from your email.",
      });
      return;
    }
    if (!password || !confirm) {
      setMsg({
        type: "error",
        text: "Please enter and confirm your new password.",
      });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code, // token from the email URL
          password, // new password
          passwordConfirmation: confirm,
        }),
      });

      let body = null,
        raw = "";
      try {
        body = await res.clone().json();
      } catch {
        try {
          raw = await res.text();
        } catch {
          console.log('eroor')
        }
      }

      if (!res.ok) {
        const errText =
          body?.error?.message || body?.message || raw || "Reset failed.";
        throw new Error(errText);
      }

      setMsg({
        type: "success",
        text: "Password reset successful. You can now log in.",
      });
      setPassword("");
      setConfirm("");
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.message || "Unable to reset password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.sub}>Set a new password for your account.</p>

        {msg.text ? (
          <div
            style={{
              ...styles.alert,
              ...(msg.type === "error" ? styles.err : styles.ok),
            }}
          >
            {msg.text}
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <label style={styles.label}>
            New Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label style={styles.label}>
            Confirm Password
            <input
              style={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button style={styles.btn} type="submit" disabled={submitting}>
            {submitting ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b0d12",
    padding: "24px",
  },
  card: {
    width: "min(420px, 92vw)",
    background: "rgba(25,25,25,.85)",
    color: "#fff",
    border: "1px solid rgba(233,165,96,.5)",
    borderRadius: 14,
    padding: "16px 16px 18px",
    boxShadow: "0 16px 40px rgba(0,0,0,.45)",
  },
  title: { margin: "4px 0 2px", fontSize: "1.35rem", fontWeight: 800 },
  sub: { margin: "0 0 10px", color: "#c9cdd4", fontSize: ".95rem" },
  alert: {
    margin: "8px 0",
    padding: "8px 10px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: ".9rem",
  },
  err: {
    background: "rgba(255,83,83,.16)",
    border: "1px solid rgba(255,83,83,.45)",
  },
  ok: {
    background: "rgba(55,208,123,.18)",
    border: "1px solid rgba(55,208,123,.45)",
  },
  label: {
    display: "grid",
    gridTemplateColumns: "max-content 1fr",
    gap: 10,
    alignItems: "center",
    margin: "8px 0",
  },
  input: {
    background: "rgba(255,255,255,.08)",
    border: "none",
    borderRadius: 10,
    padding: "10px 12px",
    color: "#fff",
    width: "100%",
  },
  btn: {
    marginTop: 12,
    width: "100%",
    background: "#e9a560",
    color: "#1a1a1a",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 900,
    letterSpacing: "1px",
    cursor: "pointer",
  },
};
