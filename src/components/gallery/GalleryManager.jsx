import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";
import "./galleryManager.css";


const GalleryManager = ({ albums }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const handleBack = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="gallery-manager" id="services">
      {!selectedAlbum ? (
        <div className="album-grid">
          {albums.map((album, index) => (
            <div
              key={index}
              className="album-card"
              onClick={() => handleAlbumClick(album)}
            >
              <img
                src={album.images[0]}
                alt={album.name}
                
              />
              <div className="album-title">{album.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="carousel-view">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <ImageCarousel images={selectedAlbum.images} onBack={handleBack} />
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
