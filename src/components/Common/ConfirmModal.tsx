// src/components/Common/ConfirmModal.tsx
// Modal de Confirmación Profesional - Heurística #3: Control y Libertad del Usuario
import React, { useEffect, useRef } from 'react';
import './ConfirmModal.css';

export type ConfirmModalType = 'warning' | 'danger' | 'info' | 'success';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmModalType;
  icon?: string;
  showIcon?: boolean;
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  itemsToDelete?: string[];
  countdown?: number; // Segundos para auto-cerrar
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  icon,
  showIcon = true,
  secondaryAction,
  itemsToDelete,
  countdown
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const [timeLeft, setTimeLeft] = React.useState(countdown || 0);

  // Focus trap y escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      confirmButtonRef.current?.focus();
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  // Countdown timer
  useEffect(() => {
    if (countdown && isOpen) {
      setTimeLeft(countdown);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'danger': return 'fa-exclamation-triangle';
      case 'warning': return 'fa-exclamation-circle';
      case 'success': return 'fa-check-circle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-question-circle';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`confirm-modal confirm-modal--${type}`} 
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        {/* Header */}
        <div className="confirm-modal__header">
          {showIcon && (
            <div className={`confirm-modal__icon confirm-modal__icon--${type}`}>
              <i className={`fas ${getIcon()}`}></i>
            </div>
          )}
          <h2 id="confirm-modal-title" className="confirm-modal__title">{title}</h2>
          <button 
            className="confirm-modal__close" 
            onClick={onClose}
            aria-label="Cerrar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="confirm-modal__body">
          <p id="confirm-modal-message" className="confirm-modal__message">
            {message}
          </p>

          {/* Countdown (Heurística #1: Feedback visual) */}
          {countdown && timeLeft > 0 && (
            <div className="confirm-modal__countdown">
              <i className="fas fa-clock"></i>
              Este diálogo se cerrará en {timeLeft} segundos
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="confirm-modal__footer">
          <button
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
            {cancelText}
          </button>

          {secondaryAction && (
            <button
              className="confirm-modal__btn confirm-modal__btn--secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.text}
            </button>
          )}

          <button
            ref={confirmButtonRef}
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--${type}`}
            onClick={onConfirm}
          >
            <i className={`fas ${type === 'danger' ? 'fa-trash' : 'fa-check'}`}></i>
            {confirmText}
          </button>
        </div>


      </div>
    </div>
  );
};

export default ConfirmModal;
