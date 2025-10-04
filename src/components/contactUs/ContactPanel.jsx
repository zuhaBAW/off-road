import React, { useState } from "react";
import "./contact.css";
// import { submitContact } from "../../api/ContactApi";

const WHATSAPP_NUMBER = "971523717863"; 

export default function ContactPanel() {
  const initial = { name: "", email: "", mobile: "", service: "", message: "" };
  const [formData, setFormData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target; // name must match keys in initial
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData,'formdata')
  };

  const buildMessage = () => {
    const lines = [
      "*You have an enquiry from website*",
      "",
      `Name: ${formData.name || "-"}`,
      `Email: ${formData.email || "-"}`,
      `Phone: ${formData.mobile || "-"}`,
      "",
      `Message:${formData.message || ""}`,
    ];
    // WhatsApp hard limit ~4096 chars for a single message – trim just in case
    return lines.join("\n").slice(0, 4000);
  };

  function openWhatsAppSmart() {
    const text = encodeURIComponent(buildMessage());
    // const text = encodeURIComponent(buildMessage());
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    const appUrl = `whatsapp://send?phone=+${WHATSAPP_NUMBER}&text=${text}`;

    const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Try opening the app; if blocked or not installed, fall back to Web
      const t0 = Date.now();
      window.location.href = appUrl;
      setTimeout(() => {
        if (Date.now() - t0 < 1500)
          window.open(webUrl, "_blank", "noopener,noreferrer");
      }, 600);
    } else {
      // Desktop: open WhatsApp Web directly
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }
  }


  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // await submitContact(formData);
      setStatus("success");
      // setFormData(initial);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
    console.log(initial.name, initial.message, "initial");
    

     if (!formData.name || !formData.message) {
       alert("Please fill your name and message.");
       return;
     }
    

     openWhatsAppSmart();
  };

  return (
    <section className="cp-wrap" aria-labelledby="cp-heading" id="contact">
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
            <button
              type="submit"
              className="cp-cta"
              disabled={loading}
             
            >
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
