// Rôle : État partagé de l’application.
// confirm-context : confirmation des actions.
import { createContext, useContext } from 'react';
export const ConfirmContext = createContext();
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm doit être utilisé dans ConfirmProvider.');
  return context;
};
