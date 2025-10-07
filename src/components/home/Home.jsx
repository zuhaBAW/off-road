import React, { useState, useEffect, useRef } from "react"; // NEW
import "./index.css";
import logo from "../../assets/logo.png";
import ForgotPasswordModal from "../auth/ForgotPassword"; // ⬅️ add this
import { loginUser } from "../../api/loginApi"; // ⬅️ import your API function

export default function Home() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false); // ⬅️ modal state
  const [loading, setLoading] = useState(false); // ⬅️ loading state
  const [loginError, setLoginError] = useState(""); // ⬅️ server error state
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);
  const navRef = useRef(null);

  // lock page scroll when menu is open (nice polish)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  // NEW: close on outside click, Esc key, or when resizing to desktop
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      // if click is outside the wrapper and nav
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const closeOnNavClick = (e) => {
    if (e.target.tagName.toLowerCase() === "a") setOpen(false);
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Username is required";
    if (!formData.password.trim()) errs.password = "Password is required";
    return errs;
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

      // Save JWT for authenticated requests
      localStorage.setItem("jwt", result.jwt);

      alert(`Login successful! Welcome ${result.user.username}`);
      setFormData({ username: "", password: "" });
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });

      // Optionally redirect or update state here
    } catch (err) {
      console.error("Login failed:", err);
      let msg = err.message || "Login failed";

      // Map common backend messages to user-friendly ones
      if (
        msg.includes("Internal Server Error") ||
        msg.includes("password") ||
        msg.includes("email")
      )
        msg = "Wrong email/username or password.";

      setLoginError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar a");

    const onScroll = () => {
      let current = "";
      sections.forEach((section) => {
        const top = section.offsetTop - 80; // adjust for nav height
        if (window.scrollY >= top) {
          current = section.getAttribute("id");
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${current}`
        );
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="home-section" id="home">
      <div ref={wrapRef} className={`nav-wrap ${open ? "is-open" : ""}`}>
        <img className="brand-logo" src={logo} alt="Offroad Adda" />
        <nav
          ref={navRef}
          className={`navbar ${open ? "open" : ""}`}
          onClick={closeOnNavClick}
        >
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Adventure</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#home">Login</a>
            </li>
          </ul>
        </nav>
        <button
          className="nav-burger"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>
      </div>

      <div className="home-content">
        <div className="main">
          <header className="hero" aria-label="Off-road hero">
            <div className="hero-copy">
              <h1 className="hero-title">OFF-ROAD</h1>
              <h2 className="hero-script">Adventure</h2>
              <div className="hero-tagline">
                <span>One Tribe. Endless Trails</span>
              </div>
            </div>
          </header>

          <div className="login-main">
            <div className="login-card">
              <div className="logo">
                <img src={logo} alt="Offroad Adda" />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="login-sub-card">
                  <h4>Login Here</h4>

                  <input
                    type="text"
                    name="username"
                    placeholder="Email"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-invalid={!!errors.username}
                  />
                  {errors.username && (
                    <p className="error-text">{errors.username}</p>
                  )}

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <p className="error-text">{errors.password}</p>
                  )}

                  {loginError && <p className="error-text">{loginError}</p>}

                  <p className="join-text">
                    Not a member? <a href="/register">Join now</a>
                  </p>
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
                </button>

                {/* ⬇️ Wire forgot link to open modal */}
                <div className="forgotpassword">
                  <button
                    type="button"
                    className="forgot"
                    onClick={() => setShowForgot(true)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ⬇️ Forgot Password Modal */}
      <ForgotPasswordModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
        defaultEmail={
          formData?.username?.includes("@") ? formData.username : ""
        }
      />
    </section>
  );
}
