// src/pages/NotFoundPage.tsx
// Página 404 personalizada - Heurística #9
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Header />
      <div className="not-found-page">
        <div className="not-found-container">
          <div className="not-found-animation">
            <div className="error-code">404</div>
            <div className="beer-bottles">
              <i className="fas fa-beer"></i>
              <i className="fas fa-wine-bottle"></i>
              <i className="fas fa-glass-whiskey"></i>
            </div>
          </div>

          <div className="not-found-content">
            <h1 className="not-found-title">
              <i className="fas fa-search"></i> ¡Ups! Página no encontrada
            </h1>
            
            <p className="not-found-message">
              Parece que esta página se fue de fiesta y no volvió...
            </p>

            <div className="not-found-suggestions">
              <h3>
                <i className="fas fa-lightbulb"></i> ¿Qué puedes hacer?
              </h3>
              <ul>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Verifica que la URL esté escrita correctamente
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Usa el menú de navegación para encontrar lo que buscas
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Regresa a la página anterior o al inicio
                </li>
                <li>
                  <i className="fas fa-check-circle"></i>
                  Si crees que es un error, contáctanos
                </li>
              </ul>
            </div>

            <div className="not-found-actions">
              <button 
                onClick={handleGoBack}
                className="btn btn-secondary"
              >
                <i className="fas fa-arrow-left"></i> Volver Atrás
              </button>
              
              <Link to="/" className="btn btn-primary">
                <i className="fas fa-home"></i> Ir al Inicio
              </Link>
              
              <Link to="/catalogo" className="btn btn-gold">
                <i className="fas fa-store"></i> Ver Catálogo
              </Link>
            </div>

            <div className="not-found-help">
              <p>
                <i className="fas fa-question-circle"></i>
                ¿Necesitas ayuda? 
                <Link to="/contacto"> Contáctanos aquí</Link>
              </p>
            </div>
          </div>

          {/* Productos populares como alternativa */}
          <div className="not-found-alternatives">
            <h3>
              <i className="fas fa-fire"></i> Mientras tanto, échale un vistazo a nuestros productos más populares
            </h3>
            <div className="quick-links">
              <Link to="/catalogo?categoria=cerveza" className="quick-link">
                <i className="fas fa-beer"></i>
                <span>Cervezas</span>
              </Link>
              <Link to="/catalogo?categoria=vino" className="quick-link">
                <i className="fas fa-wine-bottle"></i>
                <span>Vinos</span>
              </Link>
              <Link to="/catalogo?categoria=whisky" className="quick-link">
                <i className="fas fa-glass-whiskey"></i>
                <span>Whisky</span>
              </Link>
              <Link to="/promociones" className="quick-link">
                <i className="fas fa-tags"></i>
                <span>Ofertas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
