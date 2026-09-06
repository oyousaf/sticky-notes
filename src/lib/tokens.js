/**
 * Design tokens — single source of truth for note colors.
 * Each palette defines header/body backgrounds plus a text colour that
 * passes WCAG AA contrast against the body colour.
 */

const contrastRatio = (hex1, hex2) => {
  const lum = (hex) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const toLin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
  };
  const a = lum(hex1);
  const b = lum(hex2);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

// 2026 palette: warmer, slightly desaturated pastels — gentler on the eyes
// for late-night note-taking, with text colour chosen for AA contrast.
export const NOTE_COLORS = [
  { id: "yellow", colorHeader: "#F5D98A", colorBody: "#FBEFC8", colorText: "#1A1A1F" },
  { id: "green",  colorHeader: "#A9CFA0", colorBody: "#C9E2BD", colorText: "#15201A" },
  { id: "blue",   colorHeader: "#9CCFE0", colorBody: "#C5E5EF", colorText: "#0F2230" },
  { id: "pink",   colorHeader: "#F2B7E8", colorBody: "#FAD3F1", colorText: "#2A0F26" },
  { id: "lavender", colorHeader: "#C5B4F0", colorBody: "#DCD0F5", colorText: "#1B1235" },
];

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].id;
export const getColorById = (id) => NOTE_COLORS.find((c) => c.id === id) || NOTE_COLORS[0];

// Exposed for tests / debugging — not used at runtime.
export const _internals = { contrastRatio };