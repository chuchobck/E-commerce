// src/components/Common/StepProgress.tsx
// Indicador de Progreso - Heurística #1: Visibilidad del Estado del Sistema
import React from 'react';
import './StepProgress.css';

export interface Step {
  id: string;
  label: string;
  icon: string;
  completed?: boolean;
  current?: boolean;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  showConnectors?: boolean;
  compact?: boolean;
}

const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  showConnectors = true,
  compact = false
}) => {
  return (
    <div className={`step-progress ${compact ? 'step-progress--compact' : ''}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <React.Fragment key={step.id}>
            <div 
              className={`step-progress__item ${isCompleted ? 'step-progress__item--completed' : ''} ${isCurrent ? 'step-progress__item--current' : ''} ${isUpcoming ? 'step-progress__item--upcoming' : ''}`}
            >
              <div className="step-progress__icon">
                {isCompleted ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <i className={`fas ${step.icon}`}></i>
                )}
              </div>
              <div className="step-progress__label">
                <span className="step-progress__number">Paso {index + 1}</span>
                <span className="step-progress__text">{step.label}</span>
              </div>
            </div>

            {showConnectors && index < steps.length - 1 && (
              <div className={`step-progress__connector ${isCompleted ? 'step-progress__connector--completed' : ''}`}>
                <div className="step-progress__connector-line"></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
