export async function createRegistration(payload) {
  const url = "http://localhost:1337/api/auth/local/register";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log(data,'data')
    const message = data?.error?.message || "Something went wrong!";
     console.log(message, "from api");
    throw new Error(message);
  
  }

  if (data?.error) {
    const message = data.error.message || "Unknown error";
    console.log(message,"from api 2")
    throw new Error(message);
  }

  return data; 
}
