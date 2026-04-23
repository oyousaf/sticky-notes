import { db } from "./databases";

export const createNote = async (content) => {
  const res = await db.notes.create({
    content: JSON.stringify(content),
  });

  return {
    ...res,
    content,
  };
};

export const updateNote = async (note, updates) => {
  const newContent = {
    ...note.content,
    ...updates,
  };

  await db.notes.update(note.$id, {
    content: JSON.stringify(newContent),
  });

  return newContent;
};

export const deleteNote = async (id) => {
  await db.notes.delete(id);
};