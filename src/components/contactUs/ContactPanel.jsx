import React, { useState } from "react";
import "./contact.css";

const WHATSAPP_NUMBER = "971556719190";

export default function ContactPanel() {
  const initial = { name: "", email: "", mobile: "", service: "", message: "" };
  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildMessage = () => {
    const lines = [
      "*You have an enquiry from website*",
      "",
      `Name: ${formData.name || "-"}`,
      `Email: ${formData.email || "-"}`,
      `Phone: ${formData.mobile || "-"}`,
      `Service: ${formData.service || "-"}`,
      "",
      `Message: ${formData.message || ""}`,
    ];
    return lines.join("\n").slice(0, 4000);
  };

  const openWhatsAppSmart = () => {
    const text = encodeURIComponent(buildMessage());
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    const appUrl = `whatsapp://send?phone=+${WHATSAPP_NUMBER}&text=${text}`;
    const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      const t0 = Date.now();
      window.location.href = appUrl;
      setTimeout(() => {
        if (Date.now() - t0 < 1500)
          window.open(webUrl, "_blank", "noopener,noreferrer");
      }, 600);
    } else {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return "Please enter your name.";
    if (!formData.message.trim()) return "Please enter your message.";
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Please enter a valid email address.";
    if (formData.mobile && !/^[+\d][\d\s-]{5,}$/.test(formData.mobile))
      return "Please enter a valid phone number.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    try {
      setLoading(true);
      openWhatsAppSmart();
      setFormData(initial);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cp-wrap" id="contact">
      <h2 className="title">CONTACT US</h2>

      <div className="cp-body">
        <div className="cp-top">
          {/* EMAIL */}
          <div className="cp-block">
            <div className="cp-block-header">
              <span className="cp-ico cp-ico--email" aria-hidden="true" />
              <div className="cp-block-title">EMAIL</div>
            </div>
            <div className="cp-block-text">
              <a href="mailto:offroadadda@gmail.com">offroadadda@gmail.com</a>
            </div>
          </div>

          {/* PHONE */}
          <div className="cp-block">
            <div className="cp-block-header">
              <span className="cp-ico cp-ico--phone" aria-hidden="true" />
              <div className="cp-block-title">PHONE</div>
            </div>
            <div className="cp-block-text">
              <a href="tel:+971556719190">+971 55 671 9190</a>
            </div>
          </div>
        </div>

        {/* FORM */}
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
          />

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
        </form>
      </div>

      <div className="cp-footer">
        <div className="cp-brand">OFF-ROAD ADDA</div>
        <div className="cp-copy">
          Copyright © {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </section>
  );
}
