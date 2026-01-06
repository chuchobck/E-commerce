// src/components/Common/Toast.tsx
// Sistema de Notificaciones - Heurística #1: Visibilidad del Estado del Sistema
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: boolean;
  dismissible?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: Partial<Toast>) => string;
  hideToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    options: Partial<Toast> = {}
  ): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newToast: Toast = {
      id,
      message,
      type,
      duration: type === 'loading' ? 0 : (options.duration || 4000),
      progress: options.progress ?? true,
      dismissible: options.dismissible ?? true,
      ...options
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = useMemo(() => ({
    showToast, hideToast, updateToast, clearAll
  }), [showToast, hideToast, updateToast, clearAll]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  );
};

// Toast Container
const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({
  toasts,
  onDismiss
}) => {
  return (
    <div className="toast-container" aria-live="polite" aria-label="Notificaciones">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Individual Toast
const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleDismiss = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / toast.duration!) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          handleDismiss();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [toast.duration, handleDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'loading': return 'fa-spinner fa-spin';
      default: return 'fa-info-circle';
    }
  };

  return (
    <div 
      className={`toast toast--${toast.type} ${isLeaving ? 'toast--leaving' : ''}`}
      role="alert"
    >
      <div className="toast__icon">
        <i className={`fas ${getIcon()}`}></i>
      </div>
      
      <div className="toast__content">
        <p className="toast__message">{toast.message}</p>
        
        {toast.action && (
          <button 
            className="toast__action"
            onClick={() => {
              toast.action?.onClick();
              handleDismiss();
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {toast.dismissible && (
        <button 
          className="toast__close"
          onClick={handleDismiss}
          aria-label="Cerrar notificación"
        >
          <i className="fas fa-times"></i>
        </button>
      )}

      {toast.progress && toast.duration && toast.duration > 0 && (
        <div 
          className="toast__progress"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
};

export default ToastProvider;
