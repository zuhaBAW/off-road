const API_URL = "https://positive-health-719181f708.strapiapp.com/api";
const BOOKED_URL = `${API_URL}/booked-users`;

/** ---- Create a booking ---- */
export async function bookEvent(user) {
  const res = await fetch(BOOKED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({
      data: {
        Email: user.Email || user.email,
        EventDetails: user.EventDetails || user.events,
        date: user.date, // "YYYY-MM-DD"
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || "Booking failed");
  }
  return data;
}

/** ---- Read all existing bookings & normalize ---- */
export async function fetchBookedUsers() {
  const res = await fetch(BOOKED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);
  const json = await res.json();

  // Accept both Strapi shapes:
  // 1) { data: [{ id, attributes: {...}}] }
  // 2) { data: [{ Email, EventDetails, date, ... }]} (flat)
  const list = Array.isArray(json?.data)
    ? json.data
    : Array.isArray(json)
    ? json
    : [];

  return (list || []).map((item) => {
    const src = item?.attributes ?? item;
    return {
      email: String(src?.Email || src?.email || "")
        .toLowerCase()
        .trim(),
      event: String(
        src?.EventDetails || src?.event || src?.events || ""
      ).trim(),
      date: String(src?.date || "").trim(), // "YYYY-MM-DD"
    };
  });
}

/** ---- Build a fast lookup ---- */
export function buildBookingIndex(rows) {
  const set = new Set();
  for (const r of rows || []) {
    if (!r.email || !r.event || !r.date) continue;
    set.add(`${r.email}|${r.event}|${r.date}`);
  }
  return set;
}

/** ---- Check if user already booked (Email|Event|Date) ---- */
export function hasBooked(index, { email, event, date }) {
  if (!index) return false;
  const key = `${String(email).toLowerCase().trim()}|${String(
    event
  ).trim()}|${String(date).trim()}`;
  return index.has(key);
}
