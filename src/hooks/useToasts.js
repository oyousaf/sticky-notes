import { useCallback, useEffect, useRef, useState } from "react";

let nextId = 0;

export const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => { activeTimers.forEach(clearTimeout); activeTimers.clear(); };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) { clearTimeout(timer); timers.current.delete(id); }
  }, []);

  const push = useCallback((toast) => {
    const id = ++nextId;
    const ttl = toast.ttl ?? 4000;
    setToasts((prev) => [...prev, { id, ...toast }]);
    if (ttl > 0) {
      timers.current.set(id, setTimeout(() => dismiss(id), ttl));
    }
    return id;
  }, [dismiss]);

  return { toasts, push, dismiss };
};
