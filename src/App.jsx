import React from "react";
import "./App.css";
import bgImage from "./assets/39239.jpg";
import Home from "./components/home/Home";
import SocialBar from "./components/home/Socialbar";
import AboutWithCalendar from "./components/about/AboutUs";
import Testimonials from "./components/testimony/Testimonials";
import Navbar from "./components/navbar/Navbar";
import GalleryManager from "./components/gallery/GalleryManager";
import Explore from "./components/explore/Explore";
import ContactPanel from "./components/contactUs/ContactPanel";
import Gallery from "./components/gallery/Gallery";


function App() {

  return (
    <div style={{ backgroundColor: "black" }}>
      {/* Home Section */}
      <section
        className="home-section"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="home-content">
          {/* Navbar */}
          {/* <div
            style={{
              display: "flex",
              width: "90%",
              marginTop: "-50px",
              justifySelf: "center",
              borderTop: "#f67d0cff 2px solid",
            }}
          >
            <div style={{ marginTop: "-30px" }}>
              <img
                src={logo}
                width={"220px"}
                height={"220px"}
                marginTop={"-10px"}
              ></img>
            </div>
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
          </div> */}

          {/* Main hero */}

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
