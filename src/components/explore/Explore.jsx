import React, { useEffect, useState } from "react";
import "./explore.css";
import bgImg from "../../assets/exploreUS.jpeg";
import { fetchAlbums } from "../../api/fetchAlbums";
import { fetchEvents } from "../../api/fetchEvents";
import AlbumPreviewCarousel from "./AlbumPreviewCarousel";
import ImageCarousel from "../gallery/ImageCarousel";// Already built

export default function Explore() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const getAlbums = async () => {
      const result = await fetchAlbums();
      setAlbums(result);
    };

    getAlbums();
  }, []);

   useEffect(() => {
     const getEvents = async () => {
       const result = await fetchEvents();
      console.log(result,'everntsssss');
     };

     getEvents();
   }, []);
  

  useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = "hidden";
       window.history.pushState({ modalOpen: true }, "");
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedAlbum]);

  

   // ✅ Listen for browser Back button
   useEffect(() => {
     const handlePopState = () => {
       // If modal was open, close it instead of navigating away
       if (selectedAlbum) {
         setSelectedAlbum(null);
       }
     };
     window.addEventListener("popstate", handlePopState);
     return () => window.removeEventListener("popstate", handlePopState);
   }, [selectedAlbum]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
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
          {!selectedAlbum ? (
            <AlbumPreviewCarousel
              albums={albums}
              onAlbumClick={handleAlbumClick}
            />
          ) : (
            <div className="carousel-wrapper-in-explore">
              <button className="back-button" onClick={handleBack}>
                ← Back
              </button>
              <ImageCarousel images={selectedAlbum.images} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
