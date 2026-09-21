// toast-context : notifications.
import { createContext, useContext } from 'react';
export const ToastContext = createContext();
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast doit être utilisé dans ToastProvider.');
  return context;
};
