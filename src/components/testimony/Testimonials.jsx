import React, { useState } from "react";
import Testimony1 from "../../assets/2151476195.jpg";
import Testimony2 from "../../assets/2151476211.jpg"; // add more
import Testimony3 from "../../assets/2149447464.jpg";
import "./index.css";

const testimonials = [
  {
    img: Testimony1,
    text: "Off-Road Adda introduced me to adventures I never imagined experiencing.",
    name: "Emma L.",
    role: "Adventure Enthusiast",
  },
  {
    img: Testimony2,
    text: "The best community for off-road lovers. Every trip feels like family.",
    name: "Raj P.",
    role: "4x4 Owner",
  },
  {
    img: Testimony3,
    text: "I gained skills, friends, and memories that will last a lifetime.",
    name: "Sarah W.",
    role: "Explorer",
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const { img, text, name, role } = testimonials[current];

  return (
    <section className="t-wrapper">
      <h1 className="t-title">TESTIMONIALS</h1>

      <div className="t-row">
        {/* Left: framed photo */}
        <div className="t-photoFrame">
          <img src={img} alt={name} className="t-photo" />
        </div>

        {/* Right: quote */}
        <div className="t-quote">
          <p className="t-quoteText">
            <span className="t-qMark t-qOpen">“</span>
            {text}
            <span className="t-qMark t-qClose">”</span>
          </p>

          <span className="t-divider" aria-hidden="true" />

          <p className="t-author">
            <span className="t-name">{name}</span>
            <span className="t-role"> · {role}</span>
          </p>
        </div>

        {/* Carousel controls - outside quote */}
        <button onClick={prevSlide} className="t-btn t-btnPrev">
          ‹
        </button>
        <button onClick={nextSlide} className="t-btn t-btnNext">
          ›
        </button>
      </div>
    </section>
  );
}

export default Testimonials;
