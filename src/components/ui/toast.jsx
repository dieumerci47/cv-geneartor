import * as React from "react";
import { createPortal } from "react-dom";

const ToastContext = React.createContext({ add: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const add = React.useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    const duration = toast.duration ?? 3500;
    setToasts((prev) => [...prev, { id, ...toast }]);
    if (duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const remove = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      {createPortal(
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={
                  "pointer-events-auto min-w-[260px] max-w-[400px] rounded-lg border shadow-lg bg-white/95 backdrop-blur p-3 " +
                  (t.variant === "destructive"
                    ? "border-red-200 text-red-800"
                    : t.variant === "success"
                    ? "border-emerald-200 text-emerald-800"
                    : "border-blue-200 text-blue-900")
                }
                role="status"
                aria-live="polite"
              >
                {t.title && (
                  <div className="font-semibold leading-none mb-1">
                    {t.title}
                  </div>
                )}
                {t.description && (
                  <div className="text-sm opacity-90">{t.description}</div>
                )}
                {t.action && <div className="mt-2">{t.action}</div>}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
