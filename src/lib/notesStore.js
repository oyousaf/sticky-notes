import { decodeNote, encodeContent } from "./parser.js";
import { getColorById } from "./tokens.js";

// State and persistence live together so async responses never replace newer edits.
export function createNotesStore(api, delay = 400) {
  let state = { notes: [], selectedId: null, loading: true, error: null, creating: false };
  const listeners = new Set();
  const timers = new Map();
  const queues = new Map();
  const revisions = new Map();
  let loadVersion = 0;
  let stack = 0;
  const emit = (patch) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  const replace = (id, patch) => emit({ notes: state.notes.map((note) => note.id === id ? { ...note, ...patch } : note) });
  const enqueue = (id, operation) => {
    const previous = queues.get(id) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(operation);
    queues.set(id, next);
    void next.finally(() => { if (queues.get(id) === next) queues.delete(id); }).catch(() => {});
    return next;
  };
  const flush = (id) => {
    if (!timers.has(id)) return queues.get(id) ?? Promise.resolve();
    clearTimeout(timers.get(id));
    timers.delete(id);
    const note = state.notes.find((item) => item.id === id);
    if (!note) return Promise.resolve();
    const revision = revisions.get(id);
    return enqueue(id, async () => {
      try {
        await api.update(id, { content: encodeContent(note) });
        if (revisions.get(id) === revision) replace(id, { _saving: false, _error: null });
      } catch (error) {
        if (revisions.get(id) === revision) replace(id, { _saving: false, _error: error.message });
        // Keep the local draft visible and retryable instead of discarding text.
      }
    });
  };
  const update = (id, patch) => {
    if (!state.notes.some((note) => note.id === id)) return;
    revisions.set(id, (revisions.get(id) ?? 0) + 1);
    replace(id, { ...patch, _saving: true, _error: null });
    clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => { void flush(id); }, delay));
  };
  return {
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => state,
    select: (selectedId) => emit({ selectedId }),
    async load() {
      const version = ++loadVersion;
      emit({ loading: true, error: null });
      try {
        const rows = await api.list();
        if (!Array.isArray(rows)) throw new Error("The notes server returned an invalid response.");
        const notes = rows.map(decodeNote);
        if (version === loadVersion) emit({ notes, loading: false });
      } catch (error) {
        if (version === loadVersion) emit({ error, loading: false });
      }
    },
    async create(snapshot) {
      if (state.creating) return null;
      emit({ creating: true });
      const offset = (stack++ % 6) * 24;
      const note = snapshot ?? { body: "", colors: getColorById("yellow"), position: { x: 24 + offset, y: 104 + offset } };
      try {
        const created = decodeNote(await api.create({ content: encodeContent(note) }));
        emit({ notes: [...state.notes, created], selectedId: created.id });
        return created;
      } finally {
        emit({ creating: false });
      }
    },
    update,
    flush,
    retry: (id) => { update(id, {}); return flush(id); },
    flushAll: () => Promise.all([...timers.keys()].map(flush)),
    async remove(id) {
      const snapshot = state.notes.find((note) => note.id === id);
      if (!snapshot || snapshot._deleting) return null;
      const pending = flush(id);
      replace(id, { _deleting: true });
      await pending;
      try {
        await enqueue(id, () => api.delete(id));
        emit({ notes: state.notes.filter((note) => note.id !== id), selectedId: state.selectedId === id ? null : state.selectedId });
        revisions.delete(id);
        return snapshot;
      } catch (error) {
        replace(id, { _deleting: false });
        throw error;
      }
    },
  };
}
