import { useState } from "react";
import { Icon } from "./Icon.jsx";

const Toast = ({ toast, onDismiss }) => {
  const [pending, setPending] = useState(false);
  const tone = toast.tone ?? "info";
  return (
    <div className={`toast toast-${tone}`} role="status" aria-live="polite">
      <div className="toast-body">
        {toast.title && <strong className="toast-title">{toast.title}</strong>}
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>
      {toast.action ? (
        <button
          type="button"
          className="toast-action"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            try { if (await toast.action.onClick()) onDismiss(toast.id); }
            finally { setPending(false); }
          }}
        >
          {toast.action.label}
        </button>
      ) : null}
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <Icon name="plus" size={14} className="toast-close-icon" />
      </button>
    </div>
  );
};

export const ToastStack = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Toast;
