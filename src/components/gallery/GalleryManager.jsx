import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel";
import "./galleryManager.css";

const getCoverForAlbum = (album) => {
  const list = album.media?.length ? album.media : album.images || [];
  if (!list.length) return null;

  const first = list[0];

  // If string, detect image/video by extension
  if (typeof first === "string") {
    const isVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(first);
    return isVideo
      ? { type: "video", src: first, poster: album.poster } // optional poster
      : { type: "image", src: first };
  }

  // Object case
  return {
    type: first.type === "video" ? "video" : "image",
    src: first.src,
    poster: first.poster,
  };
};

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
          {albums.map((album, index) => {
            const cover = getCoverForAlbum(album);
            return (
              <div
                key={index}
                className="album-card"
                onClick={() => handleAlbumClick(album)}
              >
                {cover?.type === "video" ? (
                  <div className="album-cover">
                    <video
                      src={cover.src}
                      poster={cover.poster}
                      muted
                      playsInline
                      /* a tiny hint frame */
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => e.currentTarget.pause()}
                    />
                    <div className="album-badge">▶</div>
                  </div>
                ) : (
                  <img
                    className="album-cover"
                    src={cover?.src}
                    alt={album.name}
                  />
                )}
                <div className="album-title">{album.name}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="carousel-view">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>

          {/* Prefer 'media' if present; fallback to 'images' (strings) */}
          
              <ImageCarousel media={selectedAlbum.images} onBack={handleBack} />

          
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
