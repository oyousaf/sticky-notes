import { createContext } from "react";
import { useState, useEffect } from "react";
import Spinner from "../icons/Spinner";
import { db } from "../appwrite/databases";

export const NotesContext = createContext();

const NotesProvider = ({ children }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const response = await db.notes.list();

    const normalised = response.documents.map((note) => {
      let parsedContent;
      let parsedColors;
      let parsedPosition;

      try {
        parsedContent = JSON.parse(note.content);
      } catch {
        parsedContent = note.content;
      }

      try {
        parsedColors = parsedContent.colors
          ? JSON.parse(parsedContent.colors)
          : parsedContent.colors;
      } catch {
        parsedColors = parsedContent.colors;
      }

      try {
        parsedPosition = parsedContent.position
          ? JSON.parse(parsedContent.position)
          : parsedContent.position;
      } catch {
        parsedPosition = parsedContent.position;
      }

      return {
        ...note,
        content: {
          ...parsedContent,
          colors: parsedColors,
          position: parsedPosition,
        },
      };
    });

    setNotes(normalised);
    setLoading(false);
  };

  const contextData = { notes, setNotes, selectedNote, setSelectedNote };

  return (
    <NotesContext.Provider value={contextData}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NotesContext.Provider>
  );
};
export default NotesProvider;
