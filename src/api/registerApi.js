// /api/RegistrationApi.js
const API_BASE = "http://localhost:1337";

/**
 * Create a Registration entry in Strapi.
 * - Endpoint assumes a collection type named "registration" (UID: api::registration.registration)
 * - If you named it "registrations", Strapi REST path is still /api/registrations.
 * - If protected, pass a JWT; we'll attach Authorization.
 */
export async function createRegistration(exactPayload, jwt) {
  const res = await fetch(`${API_BASE}/api/auth/local/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify({ data: exactPayload }), // Strapi expects { data: ... }
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = { message: `HTTP ${res.status}` };
    }
    throw err;
  }
  return res.json(); // { data: { id, attributes } }
}
