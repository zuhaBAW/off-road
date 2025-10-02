import React, { useState } from "react";
import "./contact.css";
import { submitContact } from "../../api/ContactApi";

export default function ContactPanel() {
  const initial = { name: "", email: "", mobile: "", service: "", message: "" };
  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target; // name must match keys in initial
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await submitContact(formData);
      setStatus("success");
      setFormData(initial);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cp-wrap" aria-labelledby="cp-heading">
      <h2 id="cp-heading" className="title">
        CONTACT US
      </h2>

      <div className="cp-body">
        <div className="cp-top">
          <div className="cp-block">
            <div className="cp-block-title">
              <span className="cp-ico">📧</span> EMAIL
            </div>
            <div className="cp-block-text">off-Roadadda@gmail.com</div>
          </div>
          <div className="cp-block">
            <div className="cp-block-title">
              <span className="cp-ico">📞</span> PHONE
            </div>
            <div className="cp-block-text">+971 556719190</div>
          </div>
        </div>

        <form className="cp-form" onSubmit={handleSubmit} noValidate>
          <div className="cp-row2">
            <input
              className="cp-input"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
            <input
              className="cp-input"
              name="mobile"
              placeholder="Phone"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              autoComplete="tel"
              required
            />
          </div>

          <input
            className="cp-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          {/* Optional service field (kept for completeness) */}
          {/* <input
            className="cp-input"
            name="service"
            placeholder="Service (optional)"
            value={formData.service}
            onChange={handleChange}
          /> */}

          <textarea
            className="cp-textarea"
            name="message"
            placeholder="Message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
          />

          <div className="cp-ctaRow">
            <button type="submit" className="cp-cta" disabled={loading}>
              {loading ? "Sending..." : "CONTACT US"}
            </button>
          </div>

          {status === "success" && (
            <p className="success-text">✅ Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="error-text">❌ Failed to send message. Try again.</p>
          )}
        </form>
      </div>

      <div className="cp-footer">
        <div className="cp-brand">OFF-ROAD ADDA</div>
        <div className="cp-copy">Copyright © 2025 All rights reserved</div>
      </div>
    </section>
  );
}
