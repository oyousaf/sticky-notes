import { useCallback, useEffect, useRef } from "react";

export const useDrag = (ref, { onMove, onEnd }) => {
  const callbacks = useRef({ onMove, onEnd });
  const cleanup = useRef(() => {});
  useEffect(() => { callbacks.current = { onMove, onEnd }; }, [onMove, onEnd]);
  useEffect(() => () => cleanup.current(), []);

  const onPointerDown = useCallback((event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    const node = ref.current;
    if (!node) return;
    cleanup.current();
    event.preventDefault();
    node.focus({ preventScroll: true });
    const origin = { x: node.offsetLeft, y: node.offsetTop };
    const start = { x: event.clientX, y: event.clientY };
    const pointerId = event.pointerId;
    let position = origin;
    let moved = false;
    const move = (e) => {
      if (e.pointerId !== pointerId) return;
      position = { x: Math.max(0, origin.x + e.clientX - start.x), y: Math.max(80, origin.y + e.clientY - start.y) };
      moved = true;
      callbacks.current.onMove(position);
    };
    const clear = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
      document.body.classList.remove("is-dragging");
    };
    const finish = (e) => {
      if (e.pointerId !== pointerId) return;
      clear();
      callbacks.current.onEnd(moved ? position : null);
    };
    const cancel = () => { clear(); callbacks.current.onEnd(null); };
    cleanup.current = clear;
    document.body.classList.add("is-dragging");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
  }, [ref]);
  return { onPointerDown };
};
