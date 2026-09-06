import { useRef } from "react";
import NoteCard from "./NoteCard.jsx";
import Toolbar from "./Toolbar.jsx";
import { ToastStack } from "./Toast.jsx";
import { Icon } from "./Icon.jsx";
import { useNotes } from "../hooks/useNotes.js";
import { useToasts } from "../hooks/useToasts.js";
import { getColorById } from "../lib/tokens.js";

const NotesBoard = () => {
  const boardRef = useRef(null);
  const notes = useNotes();
  const toasts = useToasts();
  const create = async (snapshot) => {
    try {
      const restored = await notes.create(snapshot);
      if (!restored) throw new Error("Please wait for the current note to finish creating.");
      return true;
    } catch {
      toasts.push({ tone: "error", title: "Couldn't create note", message: "Check your connection and try again." });
      return false;
    }
  };
  const handleAdd = () => {
    const board = boardRef.current;
    void create({ body: "", colors: getColorById("yellow"), position: { x: board.scrollLeft + Math.min(120, Math.max(16, (board.clientWidth - 280) / 2)), y: board.scrollTop + 110 + (notes.notes.length % 5) * 24 } });
  };
  const handleDelete = async (id) => {
    try {
      const snapshot = await notes.remove(id);
      if (!snapshot) return;
      toasts.push({ tone: "info", title: "Note deleted", action: { label: "Undo", onClick: () => create(snapshot) }, ttl: 0 });
    } catch {
      toasts.push({ tone: "error", title: "Couldn't delete note", message: "Your note is still here. Try again." });
    }
  };
  return (
    <>
      <a href="#main" className="skip-link">Skip to notes</a>
      <main id="main" tabIndex={-1} ref={boardRef} className="board" aria-label="Notes canvas"
        onPointerDown={(event) => { if (event.target === event.currentTarget) notes.select(null); }}>
        <header className="board-heading">
          <div className="board-brand">
            <img className="board-logo" src="/favicon.svg" width="44" height="44" alt="" />
            <div><h1>Notes<span className="board-count">{notes.notes.length}</span></h1><p>A little space for everything on your mind.</p></div>
          </div>
          <p id="board-help">Drag a note by its header. Focus a card to move it with arrow keys; Enter to write, Esc to finish.</p>
        </header>
        {notes.loading ? (
          <div className="board-loading" role="status"><Icon name="spinner" size={32} className="board-loading-spin" /><span>Loading notes…</span></div>
        ) : notes.error ? (
          <div className="board-empty" role="alert"><h2 className="board-empty-title">Couldn&apos;t load your notes</h2><p className="board-empty-text">Check your connection and try again.</p><button className="primary-button" onClick={notes.load}>Try again</button></div>
        ) : notes.notes.length === 0 ? (
          <div className="board-empty"><div className="board-empty-card" aria-hidden="true"><Icon name="note" size={48} /></div><h2 className="board-empty-title">Make room for an idea</h2><p className="board-empty-text">A thought, a list, a reminder. Start anywhere.</p><button className="primary-button" onClick={handleAdd} disabled={notes.creating}>Add your first note</button></div>
        ) : notes.notes.map((note) => (
          <NoteCard key={note.id} note={note} isSelected={note.id === notes.selectedId} onSelect={notes.select} onUpdate={notes.update} onDelete={handleDelete} onFlush={notes.flush} onRetry={notes.retry} />
        ))}
        <Toolbar canColor={!!notes.selectedNote && !notes.selectedNote._deleting} activeColorId={notes.selectedNote?.colors.id} onAdd={handleAdd}
          onColor={(id) => notes.update(notes.selectedId, { colors: getColorById(id) })} pending={notes.creating || notes.loading || !!notes.error} />
      </main>
      <ToastStack toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </>
  );
};
export default NotesBoard;

