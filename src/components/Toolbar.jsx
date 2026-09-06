import { useCallback } from "react";
import { Icon } from "./Icon.jsx";
import { NOTE_COLORS } from "../lib/tokens.js";

const Toolbar = ({
  canColor = false,
  onAdd,
  onColor,
  activeColorId,
  pending = false,
}) => {
  const handleAdd = useCallback(() => {
    if (!pending) onAdd?.();
  }, [pending, onAdd]);

  return (
    <aside className="toolbar" aria-label="Note tools">
      <button
        type="button"
        className="toolbar-add"
        onClick={handleAdd}
        disabled={pending}
        aria-label="Add note"
        title="Add note"
      >
        <Icon name="plus" size={22} />
      </button>

      <div className="toolbar-divider" role="separator" aria-orientation="horizontal" />

      <div className="toolbar-colors" role="group" aria-label="Note colour">
        {NOTE_COLORS.map((c) => {
          const selected = activeColorId === c.id;
          const disabled = !canColor;
          return (
            <button
              key={c.id}
              type="button"
              aria-label={`${c.id} note`}
              aria-pressed={selected}
              aria-disabled={disabled}
              disabled={disabled}
              className={`toolbar-color${selected ? " is-selected" : ""}`}
              style={{ "--swatch": c.colorHeader }}
              onClick={() => onColor?.(c.id)}
              title={disabled ? "Select a note first" : `Set colour to ${c.id}`}
            />
          );
        })}
      </div>
    </aside>
  );
};

export default Toolbar;
