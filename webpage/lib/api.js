const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function submitContact({ name, email, subject, message }) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, subject, message }),
  });
}

export async function subscribe(email) {
  return request("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
