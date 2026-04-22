import React, { useRef, useContext, useState } from "react";
import Plus from "../icons/Plus";
import colors from "../assets/colors.json";
import { NotesContext } from "../context/NotesContext";
import { createNote } from "../lib/notesApi";

const AddButton = () => {
  const { setNotes } = useContext(NotesContext);
  const startingPos = useRef(10);
  const [creating, setCreating] = useState(false);

  const addNote = async () => {
    if (creating) return;

    setCreating(true);

    const content = {
      body: "",
      colors: colors[0],
      position: {
        x: startingPos.current,
        y: startingPos.current,
      },
    };

    startingPos.current += 10;

    try {
      const newNote = await createNote(content);
      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      id="add-btn"
      onClick={addNote}
      style={{
        cursor: creating ? "not-allowed" : "pointer",
        opacity: creating ? 0.6 : 1,
      }}
    >
      <Plus />
    </div>
  );
};

export default AddButton;
