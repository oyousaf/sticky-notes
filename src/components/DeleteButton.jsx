import Trash from "../icons/Trash";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { deleteNote } from "../lib/notesApi";

const DeleteButton = ({ noteId }) => {
  const { setNotes } = useContext(NotesContext);

  const handleDelete = async () => {
    setNotes((prev) => prev.filter((n) => n.$id !== noteId));
    await deleteNote(noteId);
  };

  return (
    <div onClick={handleDelete}>
      <Trash />
    </div>
  );
};

export default DeleteButton;
