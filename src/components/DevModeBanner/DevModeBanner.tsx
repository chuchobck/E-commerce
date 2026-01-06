import React from 'react';
import './DevModeBanner.css';

interface DevModeBannerProps {
  show?: boolean;
}

const DevModeBanner: React.FC<DevModeBannerProps> = ({ show = true }) => {
  if (!show) return null;

  return (
    <div className="dev-mode-banner">
      <div className="dev-mode-content">
        <i className="fas fa-flask"></i>
        <span className="dev-mode-text">
          <strong>MODO DESARROLLO</strong> - Login temporal activo
        </span>
        <button 
          className="dev-mode-info-btn"
          onClick={() => alert(
            '🧪 MODO TEMPORAL ACTIVO\n\n' +
            'Credenciales de prueba:\n' +
            '• admin / admin123\n' +
            '• cliente / cliente123\n' +
            '• demo / demo123\n\n' +
            'Este modo no requiere backend.\n' +
            'Ver CREDENCIALES_PRUEBA.md para más info.'
          )}
        >
          <i className="fas fa-info-circle"></i>
        </button>
      </div>
    </div>
  );
};

export default DevModeBanner;
