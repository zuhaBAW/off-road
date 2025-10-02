// components/gallery/AlbumPreviewCarousel.jsx
import React from "react";
import "./albumPreviewCarousel.css";

const AlbumPreviewCarousel = ({ albums, onAlbumClick }) => {
  return (
    <div className="album-preview-carousel">
      {albums.map((album, index) => (
        <div
          key={index}
          className="album-preview-card"
          onClick={() => onAlbumClick(album)}
        >
          <img
            src={album.images[0]}
            alt={album.name}
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />
          <div className="album-preview-title">{album.name}</div>
        </div>
      ))}
    </div>
  );
};

export default AlbumPreviewCarousel;
