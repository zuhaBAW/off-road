import React from "react";
import "./App.css";
import bgImage from "./assets/jeep.jpeg";

import Home from "./components/home/Home";
import SocialBar from "./components/home/Socialbar";
import AboutWithCalendar from "./components/about/AboutUs";
import Testimonials from "./components/testimony/Testimonials";
import Navbar from "./components/navbar/Navbar";
import GalleryManager from "./components/gallery/GalleryManager";
import Explore from "./components/explore/Explore";
import ContactPanel from "./components/contactUs/ContactPanel";
import Gallery from "./components/gallery/Gallery";
// import logo from "./assets/logo.png"


function App() {

  return (
    <div style={{ backgroundColor: "black" }}>
      {/* Home Section */}
      <section
        className="home-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="home-content">
        
          <Home />
          <SocialBar />
        </div>
      </section>

      <AboutWithCalendar />

      {/* Another Section (scrollable content) */}
      <section>
        <Explore />
        <Testimonials />
        <ContactPanel />

    
        {/* <Gallery /> */}
      </section>

      {/* <section><ContacUs/></section> */}
    </div>
  );
}

export default App;
