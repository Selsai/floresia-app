import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import './ConfirmModal.css';

const ConfirmContext = createContext();

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setState({
        title: options.title || 'Confirmer l\'action',
        message: options.message || 'Êtes-vous sûr de vouloir continuer ?',
        confirmLabel: options.confirmLabel || 'Confirmer',
        cancelLabel: options.cancelLabel || 'Annuler',
        danger: options.danger ?? true,
      });
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = (result) => {
    setState(null);
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div className="confirm-overlay" onClick={() => handleClose(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`confirm-icon ${state.danger ? 'danger' : ''}`}>
              <FiAlertTriangle />
            </div>
            <h3>{state.title}</h3>
            <p>{state.message}</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => handleClose(false)}>
                {state.cancelLabel}
              </button>
              <button
                className={state.danger ? 'confirm-confirm danger' : 'confirm-confirm'}
                onClick={() => handleClose(true)}
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};