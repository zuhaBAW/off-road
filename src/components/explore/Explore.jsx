import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import "./explore.css";
import bgImg from "../../assets/exploreUS.jpeg";
import { fetchAlbums } from "../../api/fetchAlbums";
import { fetchEvents } from "../../api/fetchEvents";
import AlbumPreviewCarousel from "./AlbumPreviewCarousel";
import ImageCarousel from "../gallery/ImageCarousel";

/* ------------------ Fullscreen modal (unchanged behavior) ------------------ */
function GalleryModal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;

    const y = window.scrollY;
    document.body.dataset.galleryScrollY = String(y);
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      const top = parseInt(document.body.style.top || "0", 10) || 0;
      document.body.removeAttribute("style");
      window.scrollTo(0, -top);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="gallery-overlay" role="dialog" aria-modal="true">
      <button className="gallery-back" onClick={onClose}>
        ← Back
      </button>
      <div className="gallery-surface">{children}</div>
    </div>,
    document.body
  );
}

/* --------------------------------- Explore --------------------------------- */
export default function Explore() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const result = await fetchAlbums();
      setAlbums(result || []);
    })();
  }, []);

  // optional (left as-is for your logs)
  useEffect(() => {
    (async () => {
      const result = await fetchEvents();
      console.log(result, "events");
    })();
  }, []);

  // back button closes modal
  useEffect(() => {
    if (!selectedAlbum) return;
    window.history.pushState({ galleryOpen: true }, "");
  }, [selectedAlbum]);
  useEffect(() => {
    const onPop = () => selectedAlbum && setSelectedAlbum(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selectedAlbum]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    // make sure modal opens with Explore in view
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const handleBack = () => {
    setSelectedAlbum(null);
    if (window.history.state?.galleryOpen) window.history.back();
  };

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="explore-hero"
      style={{ "--explore-bg": `url(${bgImg})` }}
    >
      <div className="explore-wrap">
        {/* Centered headline */}
        <header className="explore-head">
          <h2 className="explore-title">EXPLORE</h2>
          <p className="explore-sub">Our Journey</p>
        </header>

        {/* Gallery row below the title */}
        <AlbumPreviewCarousel albums={albums} onAlbumClick={handleAlbumClick} />
      </div>

      {/* Fullscreen modal for images */}
      <GalleryModal open={!!selectedAlbum} onClose={handleBack}>
        {selectedAlbum && (
          <ImageCarousel
            media={selectedAlbum.media || selectedAlbum.images}
            images={selectedAlbum.images}
            onBack={handleBack}
          />
        )}
      </GalleryModal>
    </section>
  );
}
