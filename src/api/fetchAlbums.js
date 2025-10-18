export async function fetchAlbums() {
  try {
    const res = await fetch(
      "https://enduring-laughter-217c2dfbab.strapiapp.com/api/galleries?populate=*"
    );
    const json = await res.json();

    // const baseUrl = "https://enduring-laughter-217c2dfbab.strapiapp.com/";

    const albums = json.data.map((item) => {
      const albumName = item.name || "Untitled";
      const photos = item.photo || [];

      const images = photos
        .map((photo) => {
          const imageUrl = photo.url;
          return imageUrl ? `${imageUrl}` : null;
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
