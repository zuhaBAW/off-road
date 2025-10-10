import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./login.css";

import logo from "../../assets/logo.png";
import { loginUser } from "../../api/loginApi";
import RegistrationForm from "../registration/Register";
import ForgotPasswordModal from "../auth/ForgotPassword";

export default function LoginModal({ isOpen, onClose, onJoinNow, onForgot }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

//   const [openRegistration, setOpenRegistration] = useState(false);
//   const [openForgot, setOpenForgot] = useState(false);

  const emailRef = useRef(null);

  // open/close effects (focus + scroll lock + Esc)
  useEffect(() => {
    if (!isOpen) return;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    setTimeout(() => emailRef.current?.focus(), 80);

    return () => {
      window.removeEventListener("keydown", onKey);
      const top = parseInt(document.body.style.top || "0", 10) || 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = "Username is required";
    if (!formData.password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    setErrors({});
    setLoading(true);

    try {
      const result = await loginUser({
        identifier: formData.username,
        password: formData.password,
      });

      localStorage.setItem("jwt", result.jwt);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("scrollTarget", "about");

      alert(`Login successful! Welcome ${result.user.username}`);
      window.location.reload();
    } catch (err) {
      let msg = err?.message || "Login failed";
      if (
        msg.includes("Internal Server Error") ||
        msg.includes("password") ||
        msg.includes("email")
      ) {
        msg = "Wrong email/username or password.";
      }
      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  const stop = (e) => e.stopPropagation();

  return ReactDOM.createPortal(
    <div className="lm2-overlay" onClick={onClose} role="dialog" aria-modal>
      <div className="lm2-shell" onClick={stop}>
        {/* close */}

        {/* top centered logo */}

        {/* glass outer panel */}
        <div className="lm2-panel">
          {/* lighter inner card */}
          <button className="lm2-close" aria-label="Close" onClick={onClose}>
            X
          </button>
          <div className="lm2-logo">
            <img src={logo} alt="Offroad Adda" />
          </div>
          <form
            id="loginForm"
            className="lm2-inner"
            onSubmit={handleSubmit}
            noValidate
          >
            <h3 className="lm2-title">Login Here</h3>

            <label className="lm2-field">
              <span className="lm2-ico">👤</span>
              <input
                ref={emailRef}
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, username: e.target.value }))
                }
                aria-invalid={!!errors.username}
              />
            </label>
            {errors.username && <p className="lm2-error">{errors.username}</p>}

            <label className="lm2-field">
              <span className="lm2-ico">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                aria-invalid={!!errors.password}
              />
            </label>
            {errors.password && <p className="lm2-error">{errors.password}</p>}
            {loginError && <p className="lm2-error">{loginError}</p>}

            <div className="lm2-divider" aria-hidden />
            <p className="lm2-join">
              Not a member?{" "}
              <button
                type="button"
                className="lm2-join-btn"
                onClick={onJoinNow}
              >
                <span>Join now</span>
              </button>
            </p>
            {/* <div className="lm2-avatars" aria-hidden>
              <span className="lm2-avatar" />
              <span className="lm2-avatar" />
              <span className="lm2-avatar" />
            </div> */}
          </form>
          <button
            className="lm2-cta"
            type="submit"
            form="loginForm"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Optional: forgot password link (keep, but no visual conflict) */}
          <div className="lm2-forgot">
            <button type="button" className="lm2-forgot-btn" onClick={onForgot}>
              Forgot Password?
            </button>
          </div>
        </div>

        {/* big amber button OUTSIDE the panel but still submits the form */}

        {/* children modals */}
        {/* <RegistrationForm
          isOpen={openRegistration}
          onClose={() => setOpenRegistration(false)}
        />
        <ForgotPasswordModal
          open={openForgot}
          onClose={() => setOpenForgot(false)}
          defaultEmail={
            formData?.username?.includes("@") ? formData.username : ""
          }
        /> */}
      </div>
    </div>,
    document.body
  );
}
