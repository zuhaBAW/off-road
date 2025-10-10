import React, { useEffect } from "react";
import "./App.css";

import bgImage from "./assets/jeep.jpeg";
// import bgVideo from "./assets/bgvideo.mp4";

import Navbar from "./components/navbar/Navbar"; // your existing navbar
import HomeHero from "./components/home/HomeHero"; // NEW: hero-only (no login)
import SocialBar from "./components/home/Socialbar"; // your existing social bar

import AboutWithCalendar from "./components/about/AboutUs";
import Explore from "./components/explore/Explore";
import Testimonials from "./components/testimony/Testimonials";
import ContactPanel from "./components/contactUs/ContactPanel";

export default function App() {
  useEffect(() => {
    const target = localStorage.getItem("scrollTarget");
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 350);
      }
      localStorage.removeItem("scrollTarget");
    }
  }, []);

  return (
    <div  style={{ backgroundColor: "#000" }}>
      {/* Sticky site-wide navbar */}
      <div className="app-sticky-nav">
        <Navbar />
      </div>

      {/* HOME / HERO */}
      <section
        id="home"
        className="home-section"
        style={{ backgroundImage: `url(${bgImage})`}}
      >
        {/* background video (behind everything) */}
        {/* <div className="video-background" aria-hidden="true">
          <video autoPlay muted loop playsInline className="bg-video">
            <source src={bgVideo} type="video/mp4" />
          </video>
        </div> */}

        {/* hero copy (no login) */}
        <HomeHero />

        {/* social row */}
        <SocialBar />
      </section>

      {/* OTHER SECTIONS */}
      <AboutWithCalendar />
      <Explore />
      <Testimonials />
      <ContactPanel />
    </div>
  );
}
