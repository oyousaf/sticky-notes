const BASE = "http://204.168.141.215:3002/api/notes";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const response = await fetch(`${BASE}/${id}`);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      const response = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      await fetch(`${BASE}/${id}`, {
        method: "DELETE",
      });

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
