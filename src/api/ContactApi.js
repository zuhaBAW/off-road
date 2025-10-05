const API_URL = "http://localhost:1337/api/contact";

export async function submitContact(formData) {
  try {
    const payload = {
      name: formData.name?.trim() || "",
      email: formData.email?.trim() || "",
      mobile: formData.mobile?.trim() || "", // or phone -> rename here
      message: formData.message?.trim() || "",
      service: formData.service?.trim() || "", // optional
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // ⬅️ no { data: ... }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Status ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Contact API Error:", error);
    throw error;
  }
}
