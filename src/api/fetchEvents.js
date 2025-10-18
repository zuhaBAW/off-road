// src/api/fetchEvents.js
// Groups events by the calendar day in Asia/Dubai and keeps a proper Date for formatting.

const TZ = "Asia/Dubai";

function ymdInTZ(date, tz = TZ) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value; // "01".."12"
  const d = parts.find((p) => p.type === "day").value; // "01".."31"
  // Unpadded month/day to match your existing keys (e.g., 2025-10-4)
  return `${y}-${String(Number(m))}-${String(Number(d))}`;
}

export async function fetchEvents() {
  try {
    const res = await fetch(
      "https://enduring-laughter-217c2dfbab.strapiapp.com/api/events?populate=*"
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();
    const items = Array.isArray(json.data) ? json.data : json.data?.data || [];
    const eventsMap = {};

    items.forEach((item) => {
      const attrs = item.attributes ?? item;

      // Your payload already includes full UTC timestamps (e.g., "...Z")
      const dateStr =
        attrs?.Date ??
        attrs?.date ??
        attrs?.datetime ??
        attrs?.date_time ??
        null;

      if (!dateStr) return;

      const d = new Date(String(dateStr).trim());
      if (isNaN(d)) return;

      // Group by Dubai's calendar day, not by the raw UTC date
      const key = ymdInTZ(d, TZ);

      const eventObj = {
        id:
          item.id ??
          attrs.id ??
          `${key}-${Math.random().toString(36).slice(2, 7)}`,
        isoDate: String(dateStr).trim(), // keep original ISO from API
        dateObj: d, // real Date (UTC-based internally)
        title: attrs?.Details ?? attrs?.details ?? attrs?.title ?? "Event",
        location: attrs?.Location ?? attrs?.location ?? attrs?.place ?? "TBA",
        raw: attrs,
      };

      if (!eventsMap[key]) eventsMap[key] = [];
      eventsMap[key].push(eventObj);
    });

    return eventsMap;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return {};
  }
}

// (Optional) export helper if you want to reuse in components
export { ymdInTZ, TZ };
