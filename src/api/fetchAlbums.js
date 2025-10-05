export async function fetchAlbums() {
  try {
    const res = await fetch("http://localhost:1337/api/galleries?populate=*");
    const json = await res.json();

    const baseUrl = "http://localhost:1337";

    const albums = json.data.map((item) => {
      const albumName = item.name || "Untitled";
      const photos = item.photo || [];

      const images = photos
        .map((photo) => {
          const imageUrl = photo.url;
          return imageUrl ? `${baseUrl}${imageUrl}` : null;
        })
        .filter(Boolean); 

      return {
        name: albumName,
        images,
      };
    });

    return albums;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    return [];
  }
}
