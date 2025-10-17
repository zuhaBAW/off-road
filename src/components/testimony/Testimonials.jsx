import React, { useState, useEffect } from "react";
import { fetchTestimonials } from "../../api/testimonial"
import Testimony1 from "../../assets/2151476195.jpg";
import Testimony2 from "../../assets/2151476211.jpg";
import Testimony3 from "../../assets/2149447464.jpg";
import "./index.css";

const fallbackImages = [Testimony1, Testimony2, Testimony3];

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await fetchTestimonials();
      setTestimonials(data);
    })();
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  if (testimonials.length === 0) {
    return (
      <section className="t-wrapper" id="testimonials">
        <h1 className="t-title">TESTIMONIALS</h1>
        <p className="t-loading">Loading testimonials...</p>
      </section>
    );
  }

  const { text, name, role, image } = testimonials[current];
  const img = image || fallbackImages[current % fallbackImages.length];

  return (
    <section className="t-wrapper" id="testimonials">
      <h1 className="t-title">TESTIMONIALS</h1>

      <div className="t-row">
        <div className="t-photoFrame">
          <img src={img} alt={name} className="t-photo" />
        </div>

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
