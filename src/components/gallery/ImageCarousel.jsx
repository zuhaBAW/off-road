import React, { useState } from "react";
import "./imageCarousel.css";


const ImageCarousel = ({ images, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

 

  const getClassName = (index) => {
    if (index === currentIndex) return "carousel-item active";
    if (index === (currentIndex - 1 + images.length) % images.length)
      return "carousel-item left";
    if (index === (currentIndex + 1) % images.length)
      return "carousel-item right";
    return "carousel-item hidden";
  };

  return (
    <div className="carousel-container">
      {onBack && (
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      )}
      <button className="nav-button left" onClick={goToPrevious}>
        <span>&#x276E;</span>
      </button>
      <div className="carousel-wrapper">
        {images.map((image, index) => (
          <div key={index} className={getClassName(index)}>
            <img src={image} alt={`slide-${index}`} />
          </div>
        ))}
      </div>
      <button className="nav-button right" onClick={goToNext}>
        <span>&#x276F;</span>
      </button>
    </div>
  );
};

export default ImageCarousel;

