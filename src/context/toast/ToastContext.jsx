// ToastContext : messages de notification.
import { useState, useCallback } from 'react';
import './Toast.css';

import { ToastContext } from './toast-context';

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, options = {}) => {
    const { duration = 3000, actionLabel, onAction } = options;
    setToast({ message, actionLabel, onAction });
    setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.actionLabel && (
            <button className="toast-action" onClick={toast.onAction}>
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
};