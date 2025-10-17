// src/components/Testimonials/testimonialService.js
export async function fetchTestimonials() {
  try {
    const res = await fetch(
      "https://positive-health-719181f708.strapiapp.com/api/testimonials?populate=*"
    );
    if (!res.ok) throw new Error("Failed to fetch testimonials");

    const json = await res.json();

    return json.data.map((item) => {
      const image =
        item.Photo?.formats?.medium?.url ||
        item.Photo?.formats?.small?.url ||
        item.Photo?.url ||
        null;

      return {
        id: item.id,
        name: item.Name,
        role: item.Description,
        text: item.Review.replace(/^“|”$/g, ""), // remove fancy quotes if present
        image,
      };
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
