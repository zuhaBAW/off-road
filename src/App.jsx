import React, { useEffect, useState } from "react";
import "./App.css";

import bgImage from "./assets/jeep.jpeg";
import bgVideo from "./assets/Banner.mp4";

import Navbar from "./components/navbar/Navbar";
import HomeHero from "./components/home/HomeHero";
import SocialBar from "./components/home/Socialbar";
import AboutWithCalendar from "./components/about/AboutUs";
import Explore from "./components/explore/Explore";
import Testimonials from "./components/testimony/Testimonials";
import ContactPanel from "./components/contactUs/ContactPanel";

export default function App() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Handle stored scroll targets
    const target = localStorage.getItem("scrollTarget");
    if (target) {
      const el = document.getElementById(target);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 350);
      localStorage.removeItem("scrollTarget");
    }
  }, []);

  useEffect(() => {
    // Show image first, then fade to video after 3 seconds
    const timer = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    // Return to image when video finishes
    setShowVideo(false);
  };

  return (
    <div style={{ backgroundColor: "#000" }}>
      <div className="app-sticky-nav">
        <Navbar />
      </div>

      <section id="home" className="home-section">
        <div className="hero-bg">
          {/* Background IMAGE */}
          <div
            className={`bg-image ${!showVideo ? "is-visible" : "is-hidden"}`}
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Background VIDEO */}
          <video
            className={`bg-video ${showVideo ? "is-visible" : "is-hidden"}`}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        </div>

        {/* Foreground hero + socials */}
        <HomeHero />
        <SocialBar />
      </section>

      <AboutWithCalendar />
      <Explore />
      <Testimonials />
      <ContactPanel />
    </div>
  );
}
