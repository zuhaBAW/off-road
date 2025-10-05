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

