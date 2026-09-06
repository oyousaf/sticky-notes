const DEFAULT_BASE = "http://204.168.141.215:3002/api/notes";

export async function proxyNotes(req, res, methods, id) {
  if (!methods.includes(req.method)) {
    res.setHeader("Allow", methods.join(", "));
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (id !== undefined && (typeof id !== "string" || !id)) return res.status(400).json({ error: "Invalid note ID" });
  const base = (process.env.API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");
  try {
    const response = await fetch(id === undefined ? base : `${base}/${encodeURIComponent(id)}`, {
      method: req.method,
      ...(req.method === "POST" || req.method === "PUT" ? {
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(req.body),
      } : {}),
      signal: AbortSignal.timeout(15000),
    });
    res.status(response.status);
    if (response.status === 204) return res.end();
    const body = await response.text();
    res.setHeader("Content-Type", response.headers.get("content-type") || "text/plain");
    return res.send(body);
  } catch {
    return res.status(502).json({ error: "The notes server is unavailable. Please try again." });
  }
}
