const FORGOT_URL = "http://localhost:1337/api/auth/forgot-password";

export async function forgotPassword(email) {
  const res = await fetch(FORGOT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let body = null,
    raw = "";
  try {
    body = await res.clone().json();
  } catch {
    try {
      raw = await res.text();
    } catch {
        console.log('error')
    }
  }

  if (!res.ok) {
    const msg =
      body?.error?.message ||
      body?.message ||
      (typeof raw === "string" && raw) ||
      `Forgot password failed (${res.status} ${res.statusText})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = body ?? raw ?? null;
    throw err;
  }

  return body ?? { ok: true };
}
