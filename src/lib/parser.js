import { DEFAULT_NOTE_COLOR, getColorById } from "./tokens.js";

const safeParse = (value) => {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return null; }
};
const coordinate = (value) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;

export const decodeNote = (row) => {
  if (!row || typeof row.$id !== "string" || !row.$id) throw new Error("Invalid note identifier.");
  const parsed = safeParse(row.content) ?? {};
  const legacyId = typeof parsed.colors?.id === "string" ? parsed.colors.id.replace(/^color-/, "") : DEFAULT_NOTE_COLOR;
  const colorId = legacyId === "purple" ? "pink" : legacyId;
  return {
    id: row.$id,
    body: typeof parsed.body === "string" ? parsed.body : "",
    colors: getColorById(colorId ?? DEFAULT_NOTE_COLOR),
    position: { x: coordinate(parsed.position?.x), y: coordinate(parsed.position?.y) },
  };
};

export const encodeContent = ({ body, colors, position }) => JSON.stringify({
  body: body ?? "",
  colors: { id: colors?.id ?? DEFAULT_NOTE_COLOR },
  position: { x: coordinate(position?.x), y: coordinate(position?.y) },
});

