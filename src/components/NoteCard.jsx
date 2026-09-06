import { memo, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";
import { useDrag } from "../hooks/useDrag.js";
import { useKeyboardNudge } from "../hooks/useKeyboardNudge.js";

const NoteCard = ({ note, isSelected, onSelect, onUpdate, onDelete, onFlush, onRetry }) => {
  const [dragPosition, setDragPosition] = useState(null);
  const textareaRef = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => {
    const node = textareaRef.current;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }, [note.body]);
  const { onPointerDown } = useDrag(cardRef, {
    onMove: setDragPosition,
    onEnd: (position) => {
      if (position) onUpdate(note.id, { position });
      setDragPosition(null);
    },
  });
  useKeyboardNudge({
    selected: isSelected && !note._deleting,
    targetRef: cardRef,
    onMove: (delta) => onUpdate(note.id, { position: { x: Math.max(0, note.position.x + delta.x), y: Math.max(80, note.position.y + delta.y) } }),
    onDelete: () => onDelete(note.id),
    onFocus: () => textareaRef.current?.focus(),
    onDeselect: () => { cardRef.current?.focus(); onSelect(null); },
  });
  const position = dragPosition ?? note.position;
  return (
    <article ref={cardRef} tabIndex={0} onFocus={() => onSelect(note.id)}
      className={`note${isSelected ? " is-selected" : ""}${note._deleting ? " is-pending" : ""}`}
      style={{ left: position.x, top: position.y, "--note-header": note.colors.colorHeader, "--note-body": note.colors.colorBody, "--note-text": note.colors.colorText }}
      aria-label="Note" aria-describedby="board-help" aria-busy={!!note._deleting}>
      <header className="note-header" onPointerDown={(event) => { if (!note._deleting) { onSelect(note.id); onPointerDown(event); } }}>
        <span className="note-saving" role="status">
          {note._saving ? <><Icon name="spinner" size={14} /> Saving</> : note._error ? "Not saved" : "Saved"}
        </span>
        <button type="button" className="note-delete" disabled={note._deleting} onClick={() => onDelete(note.id)} aria-label="Delete note"><Icon name="trash" size={16} /></button>
      </header>
      <div className="note-body">
        <textarea ref={textareaRef} value={note.body} disabled={note._deleting}
          onChange={(event) => onUpdate(note.id, { body: event.target.value })}
          onBlur={() => onFlush(note.id)} placeholder="Write a note…" aria-label="Note content" spellCheck="true" />
        {note._error && <div className="note-error" role="alert">Not saved. Keep this tab open. <button type="button" onClick={() => onRetry(note.id)}>Retry save</button></div>}
      </div>
    </article>
  );
};
export default memo(NoteCard);
