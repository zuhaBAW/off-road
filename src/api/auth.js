const API_URL = "https://positive-health-719181f708.strapiapp.com/api";

export async function bookEvent(user) {
  console.log(user.EventDetails, "from api !!!!!!");

  const res = await fetch(`${API_URL}/booked-users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
    body: JSON.stringify({
      data: {
        Email: user.Email || user.email,
        EventDetails: user.EventDetails || user.events,
        date: user.date,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || "Booking failed");
  }

  return data;
}

// src/api/bookings.js
const BOOKED_URL = "https://positive-health-719181f708.strapiapp.com/api/booked-users";

/** Fetch rows and normalize to { email, event, date } */
export async function fetchBookedUsers() {
  const res = await fetch(BOOKED_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json?.data) ? json.data : json;

  return (list || []).map((b) => ({
    email: String(b?.Email || "").toLowerCase().trim(),
    event: String(b?.EventDetails || "").trim(),
    date: String(b?.date || "").trim(), // "YYYY-MM-DD"
  }));
}

/** Build a fast lookup Set: "email|event|date" */
export function buildBookingIndex(rows) {
  const set = new Set();
  for (const r of rows || []) {
    if (!r.email || !r.event || !r.date) continue;
    set.add(`${r.email}|${r.event}|${r.date}`);
  }
  return set;
}

/** Check if user already booked */
export function hasBooked(index, { email, event, date }) {
  if (!index) return false;
  const key = `${String(email).toLowerCase().trim()}|${String(event).trim()}|${String(date).trim()}`;
  return index.has(key);
}

