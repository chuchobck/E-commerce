// src/components/Common/HelpTooltip.tsx
// Ayuda Contextual - Heurística #10: Ayuda y Documentación
import React, { useState, useRef, useEffect } from 'react';
import './HelpTooltip.css';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface HelpTooltipProps {
  content: string | React.ReactNode;
  title?: string;
  icon?: string;
  position?: TooltipPosition;
  delay?: number;
  children?: React.ReactNode;
  showOnClick?: boolean;
  maxWidth?: number;
  learnMoreUrl?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  icon = 'fa-question-circle',
  position = 'auto',
  delay = 200,
  children,
  showOnClick = false,
  maxWidth = 300,
  learnMoreUrl
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular posición automática
  useEffect(() => {
    if (isVisible && position === 'auto' && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let newPosition: TooltipPosition = 'top';

      // Verificar espacio disponible
      if (rect.top < 150) {
        newPosition = 'bottom';
      } else if (rect.bottom > viewportHeight - 150) {
        newPosition = 'top';
      } else if (rect.left < maxWidth / 2) {
        newPosition = 'right';
      } else if (rect.right > viewportWidth - maxWidth / 2) {
        newPosition = 'left';
      }

      setCalculatedPosition(newPosition);
    }
  }, [isVisible, position, maxWidth]);

  const handleMouseEnter = () => {
    if (showOnClick) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (showOnClick) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleClick = () => {
    if (showOnClick) {
      setIsVisible(!isVisible);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsVisible(!isVisible);
    }
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showOnClick &&
        isVisible &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, showOnClick]);

  const actualPosition = position === 'auto' ? calculatedPosition : position;

  return (
    <span 
      className="help-tooltip-wrapper"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isVisible}
      aria-describedby={isVisible ? 'help-tooltip-content' : undefined}
    >
      {children || (
        <span className="help-tooltip-trigger">
          <i className={`fas ${icon}`}></i>
        </span>
      )}

      {isVisible && (
        <div
          ref={tooltipRef}
          id="help-tooltip-content"
          className={`help-tooltip help-tooltip--${actualPosition}`}
          style={{ maxWidth: `${maxWidth}px` }}
          role="tooltip"
        >
          <div className="help-tooltip__arrow"></div>
          
          {title && (
            <div className="help-tooltip__header">
              <i className={`fas ${icon} help-tooltip__header-icon`}></i>
              <span className="help-tooltip__title">{title}</span>
            </div>
          )}

          <div className="help-tooltip__content">
            {content}
          </div>

          {learnMoreUrl && (
            <a 
              href={learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="help-tooltip__learn-more"
            >
              <i className="fas fa-external-link-alt"></i>
              Saber más
            </a>
          )}

          {showOnClick && (
            <button 
              className="help-tooltip__close"
              onClick={() => setIsVisible(false)}
              aria-label="Cerrar ayuda"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      )}
    </span>
  );
};

// Componente para secciones de ayuda más grandes
interface HelpSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const HelpSection: React.FC<HelpSectionProps> = ({
  title,
  children,
  icon = 'fa-info-circle',
  collapsible = true,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`help-section ${isOpen ? 'help-section--open' : ''}`}>
      <button
        className="help-section__header"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        disabled={!collapsible}
        aria-expanded={isOpen}
      >
        <i className={`fas ${icon} help-section__icon`}></i>
        <span className="help-section__title">{title}</span>
        {collapsible && (
          <i className={`fas fa-chevron-down help-section__arrow ${isOpen ? 'help-section__arrow--open' : ''}`}></i>
        )}
      </button>

      {(!collapsible || isOpen) && (
        <div className="help-section__content">
          {children}
        </div>
      )}
    </div>
  );
};

// Componente para preguntas frecuentes
interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export const FAQ: React.FC<FAQProps> = ({ items, title = 'Preguntas Frecuentes' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq">
      <h3 className="faq__title">
        <i className="fas fa-question-circle"></i>
        {title}
      </h3>
      <div className="faq__list">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`faq__item ${openIndex === index ? 'faq__item--open' : ''}`}
          >
            <button
              className="faq__question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <i className={`fas fa-chevron-down faq__arrow ${openIndex === index ? 'faq__arrow--open' : ''}`}></i>
            </button>
            {openIndex === index && (
              <div className="faq__answer">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpTooltip;
