import { proxyNotes } from "../../server/proxyNotes.js";
export default function handler(req, res) {
  if (typeof req.query.id !== "string" || !req.query.id) return res.status(400).json({ error: "Invalid note ID" });
  return proxyNotes(req, res, ["GET", "PUT", "DELETE"], req.query.id);
}
