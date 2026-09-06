import { proxyNotes } from "../../server/proxyNotes.js";
export default function handler(req, res) {
  return proxyNotes(req, res, ["GET", "POST"]);
}
