import React, { useEffect, useMemo, useState } from "react";
import LoginModal from "../login/LoginModal";
import "./navbar.css";
import logo from "../../assets/logo.png";
import ForgotPasswordModal from "../auth/ForgotPassword";
import RegistrationForm from "../registration/Register";

/* Observe sections and return the active id */
function useActiveSection(ids, navbarHeight = 68) {
  const [active, setActive] = useState(ids[0] || "home");
 

  useEffect(() => {
    if (!ids?.length) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          const id = visible[0].target.id;
          if (id && id !== active) setActive(id);
          return;
        }

        // fallback: last section above the header line
        const y = window.scrollY + navbarHeight + 2;
        let current = els[0].id;
        for (const el of els) {
          if (el.offsetTop <= y) current = el.id;
          else break;
        }
        if (current && current !== active) setActive(current);
      },
      {
        threshold: [0.25, 0.5],
        rootMargin: `-${navbarHeight + 4}px 0px -12% 0px`,
      }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, navbarHeight, active]);

  return active;
}



export default function Navbar() {
  const NAV_HEIGHT = 68;
 const [isLoginOpen, setLoginOpen] = useState(false);
 const [isRegisterOpen, setRegisterOpen] = useState(false);
 const [isForgotOpen, setForgotOpen] = useState(false);
  // Modal state
 
  useEffect(() => {
    document.body.style.overflow = isLoginOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isLoginOpen]);

  // Menu state
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scrollable links
  const links = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "explore", label: "Adventure" },
      { id: "testimonials", label: "Testimonials" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const observedIds = links.map((l) => l.id);
  const active = useActiveSection(observedIds, NAV_HEIGHT);

  const handleScrollTo = (id) => {
    setOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const handleJoinNow = () => {
    setLoginOpen(false);
    // wait for login to close (and its exit animation), then open register
    setTimeout(() => setRegisterOpen(true), 150);
  };

  const handleForgot = () => {
    setLoginOpen(false);
    setTimeout(() => setForgotOpen(true), 150);
  };
  return (
    <>
      {/* tap background for mobile menu */}
      <div
        className={`nav-scrim ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <header className={`nav-wrap ${open ? "is-open" : ""}`}>
        <img className="brand-logo" src={logo} alt="Offroad Adda" />

        <nav className={`navbar ${open ? "open" : ""}`} aria-label="Main">
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  className={`nav-link ${active === l.id ? "active" : ""}`}
                  onClick={() => handleScrollTo(l.id)}
                >
                  {l.label}
                </button>
              </li>
            ))}

            {/* ✅ Login item – opens the modal instead of scrolling */}
            <li>
              <button
                type="button"
                className="nav-link login-link"
                onClick={() => {
                  setOpen(false);
                  setLoginOpen(true);
                }}
              >
                Login
              </button>
            </li>
          </ul>
        </nav>

        <button
          className="nav-burger"
          aria-label="Toggle navigation"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>
      </header>

      {/* Modal lives at document.body via portal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onJoinNow={handleJoinNow}
        onForgot={handleForgot}
      />
      <RegistrationForm
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
      />

      <ForgotPasswordModal
        open={isForgotOpen}
        onClose={() => setForgotOpen(false)}
        // optional default email if you store it in state
        // defaultEmail={email}
      />
    </>
  );
}
