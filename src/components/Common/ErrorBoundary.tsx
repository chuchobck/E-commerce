// src/components/Common/ErrorBoundary.tsx
// Error Boundary - Heurística #9: Recuperación de errores
import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary capturó un error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Aquí podrías enviar el error a un servicio de logging
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Pantalla de error por defecto
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>

            <h1 className="error-boundary-title">
              ¡Ups! Algo salió mal
            </h1>

            <p className="error-boundary-message">
              No te preocupes, tu carrito está a salvo. Ocurrió un error inesperado, pero nuestro equipo ya fue notificado.
            </p>

            <div className="error-boundary-suggestions">
              <h3>
                <i className="fas fa-lightbulb"></i> ¿Qué puedes hacer?
              </h3>
              <ul>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Intenta recargar la página
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Regresa al inicio y continúa navegando
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Si el problema persiste, contáctanos
                </li>
              </ul>
            </div>

            <div className="error-boundary-actions">
              <button 
                onClick={this.handleReload}
                className="btn btn-primary"
              >
                <i className="fas fa-sync-alt"></i> Recargar Página
              </button>

              <a href="/" className="btn btn-gold" onClick={this.handleReset}>
                <i className="fas fa-home"></i> Volver al Inicio
              </a>

              <a href="/contacto" className="btn btn-secondary">
                <i className="fas fa-headset"></i> Contactar Soporte
              </a>
            </div>

            {/* Información técnica (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Información técnica (solo visible en desarrollo)</summary>
                <div className="error-details">
                  <h4>Error:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>Stack Trace:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
