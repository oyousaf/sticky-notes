import React, { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { updateNote } from "../lib/notesApi";

const Color = ({ color }) => {
  const { selectedNote, notes, setNotes } = useContext(NotesContext);

  const changeColor = async () => {
    if (!selectedNote) {
      alert("Select a note first");
      return;
    }

    const index = notes.findIndex((n) => n.$id === selectedNote.$id);

    const updatedContent = {
      ...selectedNote.content,
      colors: color,
    };

    const newNotes = [...notes];
    newNotes[index] = {
      ...selectedNote,
      content: updatedContent,
    };

    setNotes(newNotes);

    await updateNote(selectedNote, { colors: color });
  };

  return (
    <div
      onClick={changeColor}
      className="color"
      style={{ backgroundColor: color.colorHeader }}
    />
  );
};

export default Color;
