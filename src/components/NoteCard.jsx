import React, { useRef, useEffect, useState, useContext } from "react";

import DeleteButton from "../components/DeleteButton";
import Spinner from "../icons/Spinner";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../lib/databases";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
  // ✅ NEW: use normalised content
  const content = note.content || {};

  const body = bodyParser(content.body);
  const [position, setPosition] = useState(content.position || { x: 0, y: 0 });
  const colors = content.colors || {
    colorHeader: "#333",
    colorBody: "#444",
    colorText: "#fff",
  };

  const textAreaRef = useRef(null);
  const cardRef = useRef(null);
  const { setSelectedNote } = useContext(NotesContext);

  useEffect(() => {
    autoGrow(textAreaRef.current);
  }, []);

  // Mouse start position for dragging
  let mouseStartPos = { x: 0, y: 0 };

  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      setZIndex(cardRef.current);

      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      setSelectedNote(note);
    }
  };

  const mouseMove = (e) => {
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPosition(newPosition);
  };

  const [saving, setSaving] = useState(false);
  const keyUpTimer = useRef(null);

  // ✅ FIXED: correct payload structure
  const saveData = async (key, value) => {
    const payload = {
      content: JSON.stringify({
        ...content,
        [key]: value,
      }),
    };

    try {
      setSaving(true);
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const mouseUp = async () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    await saveData("position", newPosition);
  };

  const handleKeyUp = async () => {
    setSaving(true);

    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "absolute",
      }}
    >
      <div
        className="card-header"
        onMouseDown={mouseDown}
        style={{ backgroundColor: colors.colorHeader, cursor: "move" }}
      >
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
        <DeleteButton noteId={note.$id} />
      </div>

      <div className="card-body">
        <textarea
          ref={textAreaRef}
          onInput={() => autoGrow(textAreaRef.current)}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
          onKeyUp={handleKeyUp}
          style={{ color: colors.colorText }}
          defaultValue={body}
        />
      </div>
    </div>
  );
};

export default NoteCard;
