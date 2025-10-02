import React, { useState } from "react";
import "./index.css"; // <-- use the CSS below
import logo from "../../assets/logo.png";

export default function Home() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = "Username is required";
    if (!formData.password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    setErrors({});
    // TODO: call your login API here
    alert(`Logged in as ${formData.username}`);
  };

  return (
    <section className="home-section">
      {/* translucent top bar with logo + links */}
      <div className="nav-wrap">
        <img className="brand-logo" src={logo} alt="Offroad Adda" />
        <nav className="navbar">
          <ul>
            <li className="active">Home</li>
            <li>About</li>
            <li>Adventure</li>
            <li>Testimonials</li>
            <li>Contact</li>
            <li>Login</li>
          </ul>
        </nav>
      </div>

      {/* Main content pinned to one screen */}
      <div className="home-content">
        <div className="main">
          {/* Left: hero titles */}
          <header className="hero" aria-label="Off-road hero">
            <div className="hero-copy">
              <h1 className="hero-title">OFF-ROAD</h1>
              <h2 className="hero-script">Adventure</h2>
              <div className="hero-tagline">
                <span>One Tribe. Endless Trails</span>
              </div>
            </div>
          </header>

          {/* Right: login card */}
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
                    placeholder="Username"
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

                  <p className="join-text">
                    Not a member? <a href="#">Join now</a>
                  </p>
                </div>

                <button type="submit" className="login-btn">
                  Log In
                </button>
                <a href="#" className="forgot">
                  Forgot Password?
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
