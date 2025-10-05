

// src/components/GallerySection.jsx
import React, { useEffect, useState } from 'react';
import GalleryManager from './GalleryManager';
import { fetchAlbums } from '../../api/fetchAlbums';

const GallerySection = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums()
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching albums:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="gallery-loading">Loading gallery...</div>;
  if (albums.length === 0) return <div className="gallery-empty">No albums found.</div>;

  return <GalleryManager albums={albums} />;
};

export default GallerySection;




