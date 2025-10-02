

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


// export default function Gallery() {
//     const [gallery, setGallery] = useState([]);
//     const [extractedImages, setExtractedImages] = useState([])

//     useEffect(() => {
//         fetch(`http://localhost:1337/api/galleries?populate=*`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("Gallery API response:", data);
//                 setGallery(data.data || []);
//             })
//             .catch((err) => console.error("Error fetching gallery:", err));
//     }, []);

//   useEffect(() => {
//     const images = gallery.map((item) =>
//       item.photo?.map((photo) => `http://localhost:1337${photo.url}`)
//     );
//       setExtractedImages(images)
//       console.log(gallery)
//     console.log(images);
//   }, [gallery]);

//   return (
//     <div>
//       <ImageCarousel images={extractedImages[0]} />
//     </div>
//   );
// }

