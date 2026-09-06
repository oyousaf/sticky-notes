import { useEffect } from "react";

const STEP = 10;
const BIG_STEP = 50;

/**
 * Arrow-key nudge for a selected note. Holding shift moves by a larger step.
 * Also handles Delete to remove, Enter to focus the textarea, Escape to
 * deselect.
 */
export const useKeyboardNudge = ({ selected, targetRef, onMove, onDelete, onFocus, onDeselect }) => {
  useEffect(() => {
    if (!selected) return undefined;

    const handler = (e) => {
      // Don't hijack typing in form controls (textarea, input).
      if (!targetRef.current?.contains(e.target)) return;
      const tag = e.target.tagName;
      if (tag === "BUTTON") return;
      const isEditable = tag === "TEXTAREA" || tag === "INPUT" || e.target.isContentEditable;
      if (isEditable && e.key !== "Escape") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          onMove({ x: -STEP * (e.shiftKey ? BIG_STEP / STEP : 1), y: 0 });
          break;
        case "ArrowRight":
          e.preventDefault();
          onMove({ x: STEP * (e.shiftKey ? BIG_STEP / STEP : 1), y: 0 });
          break;
        case "ArrowUp":
          e.preventDefault();
          onMove({ x: 0, y: -STEP * (e.shiftKey ? BIG_STEP / STEP : 1) });
          break;
        case "ArrowDown":
          e.preventDefault();
          onMove({ x: 0, y: STEP * (e.shiftKey ? BIG_STEP / STEP : 1) });
          break;
        case "Enter":
          if (!isEditable) { e.preventDefault(); onFocus?.(); }
          break;
        case "Escape":
          e.preventDefault();
          onDeselect?.();
          break;
        case "Delete":
        case "Backspace":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onDelete?.();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, targetRef, onMove, onDelete, onFocus, onDeselect]);
};
