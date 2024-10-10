import React, { useRef, useEffect, useState } from "react";

import DeleteButton from "../components/DeleteButton";
import Spinner from "../icons/Spinner";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
  const body = bodyParser(note.body);
  const [position, setPosition] = useState(JSON.parse(note.position));
  const colors = JSON.parse(note.colors);

  const textAreaRef = useRef(null);
  const cardRef = useRef(null);
  const { setSelectedNote } = useContext(NotesContext);

  useEffect(() => {
    autoGrow(textAreaRef.current); // Ensure text area height is adjusted after rendering
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

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      setSaving(true); // Set saving state before trying to save
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false); // Reset saving state after trying to save
    }
  };

  const mouseUp = async () => {
    // Remove event listeners when dragging ends
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    // Save the updated position if necessary
    const newPosition = setNewOffset(cardRef.current); // {x,y}
    await saveData("position", newPosition);
  };

  const handleKeyUp = async () => {
    // Initiate "saving" state
    setSaving(true);

    // Clear existing timer if present
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    // Set timer to trigger save in 2 seconds
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
        position: "absolute", // Ensure absolute positioning for the card
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
