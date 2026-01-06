// src/components/Common/SkipLink.tsx
// Componente Skip Link - WCAG 2.4.1: Bypass Blocks
import React from 'react';

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

/**
 * SkipLink - Permite a usuarios de teclado saltar al contenido principal
 * 
 * WCAG 2.2 Criterios cumplidos:
 * - 2.4.1 Bypass Blocks (A) - Permite saltar navegación repetitiva
 * - 2.4.3 Focus Order (A) - Primer elemento enfocable
 * - 2.4.7 Focus Visible (AA) - Focus claramente visible
 */
const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId, 
  label = 'Saltar al contenido principal' 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      // Remover tabindex después para no afectar navegación normal
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    }
  };

  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {label}
    </a>
  );
};

export default SkipLink;
