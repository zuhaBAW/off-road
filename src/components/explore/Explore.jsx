// src/components/explore/Explore.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./explore.css";
import bgImg from "../../assets/exploreUS.jpeg";
import { fetchAlbums } from "../../api/fetchAlbums";
import { fetchEvents } from "../../api/fetchEvents";
import AlbumPreviewCarousel from "./AlbumPreviewCarousel";
import ImageCarousel from "../gallery/ImageCarousel";

/** ------------------------------------------------------------------
 * GalleryModal (portal)
 * - Hooks are called every render (no conditional hook call).
 * - Locks body scroll when `open` is true.
 * - Fixed Back button sits above everything.
 * ------------------------------------------------------------------ */
function GalleryModal({ open, onClose, children }) {
  // Lock/unlock page scroll depending on `open`
  useEffect(() => {
    if (!open) return; // <-- safe guard, hook still runs every render

    const y = window.scrollY;
    document.body.dataset.galleryScrollY = String(y);
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      const top = parseInt(document.body.style.top || "0", 10) || 0;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    };
  }, [open, onClose]);

  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.9)",
    zIndex: 100000,
    display: "grid",
    placeItems: "center",
    overscrollBehavior: "contain",
  };

  const surfaceStyle = {
    position: "relative",
    width: "min(1200px, 96vw)",
    height: "min(900px, 92vh)",
  };

  const backStyle = {
    position: "fixed",
    top: "18px",
    left: "18px",
    zIndex: 100001,
    padding: "6px 10px",
    fontSize: ".9rem",
    borderRadius: "10px",
    background: "#f68b00",
    color: "white",
    border: 0,
    cursor: "pointer",
  };

  return createPortal(
    <div
      className="gallery-overlay"
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="gallery-back"
        style={backStyle}
        onClick={onClose}
      >
        ← Back
      </button>
      <div className="gallery-surface" style={surfaceStyle}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function Explore() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Load albums
  useEffect(() => {
    const getAlbums = async () => {
      const result = await fetchAlbums();
      setAlbums(result || []);
    };
    getAlbums();
  }, []);

  // (Optional) events fetch
  useEffect(() => {
    const getEvents = async () => {
      const result = await fetchEvents();
      console.log(result, "events");
    };
    getEvents();
  }, []);

  // Push a history state when opening; hardware Back closes modal
  useEffect(() => {
    if (!selectedAlbum) return;
    window.history.pushState({ galleryOpen: true }, "");
  }, [selectedAlbum]);

  useEffect(() => {
    const onPop = () => {
      if (selectedAlbum) setSelectedAlbum(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selectedAlbum]);

  const handleAlbumClick = (album) => setSelectedAlbum(album);
  const handleBack = () => {
    setSelectedAlbum(null);
    if (window.history.state?.galleryOpen) {
      // Pop the state we pushed when opening
      window.history.back();
    }
  };

  return (
    <section
      id="services"
      className="explore-section"
      style={{ "--explore-bg": `url(${bgImg})` }}
    >
      <div className="explore-inner">
        <div className="explore-left">
          <h2 className="explore-title">EXPLORE</h2>
          <p className="explore-subtitle">Our Journey</p>
        </div>

        <div className="explore-right">
          <AlbumPreviewCarousel
            albums={albums}
            onAlbumClick={handleAlbumClick}
          />
        </div>
      </div>

      {/* Fullscreen modal with the carousel inside */}
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
