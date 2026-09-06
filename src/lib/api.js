const BASE = (import.meta.env.VITE_API_URL || "/api/notes").replace(/\/+$/, "");

const url = (id) => (id ? `${BASE}/${encodeURIComponent(id)}` : BASE);

const handle = async (res) => {
  if (!res.ok) {
    let detail = "";
    try { detail = await res.text(); } catch { /* ignore */ }
    throw new Error(detail || `Request failed with ${res.status}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  list: () => fetch(BASE).then(handle),
  get: (id) => fetch(url(id)).then(handle),
  create: (payload) =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  update: (id, payload) =>
    fetch(url(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handle),
  delete: (id) =>
    fetch(url(id), { method: "DELETE" }).then(handle),
};

