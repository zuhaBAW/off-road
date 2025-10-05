const API_URL = "https://positive-health-719181f708.strapiapp.com/api";

export async function loginUser(payload) {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data?.error) {
    throw new Error(data?.error?.message || "Login failed");
  }

  // Save JWT and user info
  localStorage.setItem("jwt", data.jwt);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

// Check if logged in
export function isLoggedIn() {
  return !!localStorage.getItem("jwt");
}

// Get logged in user
export function getLoggedInUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Logout
export function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
}
