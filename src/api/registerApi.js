export async function createRegistration(payload) {
  const url = "http://localhost:1337/api/auth/local/register";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Always parse JSON first
  const data = await res.json();

  // Case 1: HTTP error (400, 500, etc.)
  if (!res.ok) {
    console.log(data,'data')
    const message = data?.error?.message || "Something went wrong!";
     console.log(message, "from api");
    throw new Error(message);
  
  }

  // Case 2: Strapi responded 200 but included error
  if (data?.error) {
    const message = data.error.message || "Unknown error";
    console.log(message,"from api 2")
    throw new Error(message);
  }

  return data; // success case
}
