// Simple, robust POST to Strapi auth local register.
// Returns the parsed JSON on success or throws on failure.

export async function createRegistration(payload) {
  const url = "http://localhost:1337/api/auth/local/register";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let text = "";
    try {
      text = await res.text();
    } catch {
      console.log('error')
    }
    throw new Error(
      `Register failed (${res.status} ${res.statusText})` +
        (text ? ` – ${text}` : "")
    );
  }

  return res.json(); // Strapi typically returns { jwt, user } here
}
