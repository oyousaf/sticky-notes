import { useEffect, useState, useSyncExternalStore } from "react";
import { api } from "../lib/api.js";
import { createNotesStore } from "../lib/notesStore.js";

export const useNotes = () => {
  const [store] = useState(() => createNotesStore(api));
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => {
    void store.load();
    const warnUnsaved = (event) => {
      if (store.getSnapshot().notes.some((note) => note._saving || note._error)) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warnUnsaved);
    return () => {
      window.removeEventListener("beforeunload", warnUnsaved);
      void store.flushAll();
    };
  }, [store]);
  return { ...state, ...store, selectedNote: state.notes.find((note) => note.id === state.selectedId) ?? null };
};
