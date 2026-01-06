// src/components/Common/index.ts
// Exportación centralizada de componentes comunes para Heurísticas de Nielsen

// Heurística #3, #5: Control y Prevención de Errores
export { default as ConfirmModal } from './ConfirmModal';

// Heurística #1, #9: Visibilidad del Sistema
export { ToastProvider, useToast } from './Toast';

// Heurística #1: Visibilidad del Estado del Sistema
export { default as StepProgress } from './StepProgress';
export type { Step } from './StepProgress';

// Heurística #1, #6: Visibilidad y Reconocimiento
export { default as Breadcrumbs } from './Breadcrumbs';
export type { BreadcrumbItem } from './Breadcrumbs';

// Heurística #2, #10: Mundo Real y Ayuda
export { default as HelpTooltip, HelpSection, FAQ } from './HelpTooltip';

// Heurística #9: Recuperación de Errores
export { default as ErrorBoundary } from './ErrorBoundary';
