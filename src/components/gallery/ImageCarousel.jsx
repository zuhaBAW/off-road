import React, { useState } from "react";
import "./imageCarousel.css";

/**
 * Accepts either:
 *  - media: array of items (recommended)
 *  - images: array of strings (back-compat)
 *
 * A media item can be:
 *   - string (auto-detect by file extension)
 *   - { type: 'image'|'video', src: string, poster?: string, controls?: boolean, loop?: boolean, muted?: boolean, autoPlay?: boolean }
 */
const ImageCarousel = ({ media, images, onBack }) => {
  // Back-compat: if media not provided, treat `images` as media strings
  const items = (media && media.length ? media : images) || [];

  const normalized = items.map((item) => {
    if (typeof item === "string") {
      const url = item;
      const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
      return {
        type: isVideo ? "video" : "image",
        src: url,
        poster: undefined,
        controls: true,
        loop: true,
        muted: true,
        autoPlay: true,
      };
    }
    // object form
    return {
      type: item.type === "video" ? "video" : "image",
      src: item.src,
      poster: item.poster,
      controls: item.controls ?? true,
      loop: item.loop ?? true,
      muted: item.muted ?? true,
      autoPlay: item.autoPlay ?? true,
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? normalized.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === normalized.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getClassName = (index) => {
    if (index === currentIndex) return "carousel-item active";
    if (index === (currentIndex - 1 + normalized.length) % normalized.length)
      return "carousel-item left";
    if (index === (currentIndex + 1) % normalized.length)
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

      {normalized.length > 1 && (
        <button className="nav-button left" onClick={goToPrevious}>
          <span>&#x276E;</span>
        </button>
      )}

      <div className="carousel-wrapper">
        {normalized.map((item, index) => {
          const cls = getClassName(index);
          const isActive = index === currentIndex;

          return (
            <div key={index} className={cls}>
              {item.type === "image" ? (
                <img src={item.src} alt={`slide-${index}`} />
              ) : (
                <video
                  className="carousel-video"
                  src={item.src}
                  poster={item.poster}
                  // Autoplay video only when this slide is active
                  autoPlay={isActive && item.autoPlay}
                  loop={item.loop}
                  muted={item.muted}
                  playsInline
                  controls={isActive && item.controls}
                />
              )}
            </div>
          );
        })}
      </div>

      {normalized.length > 1 && (
        <button className="nav-button right" onClick={goToNext}>
          <span>&#x276F;</span>
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
