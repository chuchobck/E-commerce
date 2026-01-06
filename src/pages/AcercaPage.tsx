import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './AcercaPage.css';

const AcercaPage: React.FC = () => {
  return (
    <>
      <Header />

      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero__content">
              <h1 className="about-hero__title">Sobre Nosotros</h1>
              <p className="about-hero__subtitle">
                Más de 10 años compartiendo las mejores experiencias en bebidas premium
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="about-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-calendar-check stat-card__icon"></i>
                <span className="stat-card__number">10+</span>
                <p className="stat-card__label">Años de Experiencia</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-box-open stat-card__icon"></i>
                <span className="stat-card__number">500+</span>
                <p className="stat-card__label">Productos Premium</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-users stat-card__icon"></i>
                <span className="stat-card__number">15,000+</span>
                <p className="stat-card__label">Clientes Satisfechos</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-store stat-card__icon"></i>
                <span className="stat-card__number">3</span>
                <p className="stat-card__label">Sucursales</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-mission-vision">
          <div className="container">
            <div className="mv-grid">
              <div className="mv-card">
                <div className="mv-card__icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h2 className="mv-card__title">Nuestra Misión</h2>
                <p className="mv-card__text">
                  Ofrecer bebidas premium auténticas con servicio personalizado, conectando a nuestros clientes con los mejores vinos, licores y cervezas del mercado.
                </p>
              </div>

              <div className="mv-card mv-card--accent">
                <div className="mv-card__icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h2 className="mv-card__title">Nuestra Visión</h2>
                <p className="mv-card__text">
                  Ser la licorería líder en Ecuador, reconocida por calidad, variedad y servicio excepcional en bebidas premium.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="container">
            <h2 className="section-title">Nuestros Valores</h2>
            
            <div className="values-grid">
              <div className="value-card">
                <div className="value-card__icon">
                  <i className="fas fa-gem"></i>
                </div>
                <h3 className="value-card__title">Calidad Premium</h3>
                <p className="value-card__text">
                  Productos auténticos de marcas reconocidas y distribuidores autorizados.
                </p>
              </div>

              <div className="value-card">
                <div className="value-card__icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <h3 className="value-card__title">Confianza</h3>
                <p className="value-card__text">
                  Transparencia y honestidad en cada transacción con nuestros clientes.
                </p>
              </div>

              <div className="value-card">
                <div className="value-card__icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="value-card__title">Pasión</h3>
                <p className="value-card__text">
                  Asesoría experta respaldada por nuestro amor por las bebidas premium.
                </p>
              </div>

              <div className="value-card">
                <div className="value-card__icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3 className="value-card__title">Innovación</h3>
                <p className="value-card__text">
                  Catálogo actualizado con tendencias y ediciones limitadas exclusivas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="about-why-us">
          <div className="container">
            <h2 className="section-title">¿Por Qué Elegirnos?</h2>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-card__number">01</div>
                <h3 className="why-card__title">
                  <i className="fas fa-certificate"></i>
                  Productos Auténticos
                </h3>
                <p className="why-card__text">
                  Distribuidores autorizados con certificados de origen.
                </p>
              </div>

              <div className="why-card">
                <div className="why-card__number">02</div>
                <h3 className="why-card__title">
                  <i className="fas fa-user-tie"></i>
                  Asesoría Experta
                </h3>
                <p className="why-card__text">
                  Especialistas disponibles para ayudarte en tu elección.
                </p>
              </div>

              <div className="why-card">
                <div className="why-card__number">03</div>
                <h3 className="why-card__title">
                  <i className="fas fa-tags"></i>
                  Precios Competitivos
                </h3>
                <p className="why-card__text">
                  Importación directa para mejores precios sin comprometer calidad.
                </p>
              </div>

              <div className="why-card">
                <div className="why-card__number">04</div>
                <h3 className="why-card__title">
                  <i className="fas fa-gift"></i>
                  Productos Exclusivos
                </h3>
                <p className="why-card__text">
                  Ediciones limitadas y reservas especiales únicas en el país.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Section */}
        <section className="about-locations">
          <div className="container">
            <h2 className="section-title">Nuestras Sucursales</h2>

            <div className="locations-grid">
              <div className="location-card">
                <div className="location-card__icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="location-card__city">Quito</h3>
                <p className="location-card__address">
                  Av. Amazonas N24-156 y Colón<br />
                  Edificio España, Local 3
                </p>
                <p className="location-card__hours">
                  <i className="far fa-clock"></i>
                  Lun-Sáb: 9:00 AM - 8:00 PM
                </p>
                <a href="tel:+59322345678" className="location-card__phone">
                  <i className="fas fa-phone"></i>
                  (02) 234-5678
                </a>
              </div>

              <div className="location-card">
                <div className="location-card__icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="location-card__city">Guayaquil</h3>
                <p className="location-card__address">
                  Av. Francisco de Orellana<br />
                  Mall del Sol, Local 215
                </p>
                <p className="location-card__hours">
                  <i className="far fa-clock"></i>
                  Lun-Dom: 10:00 AM - 9:00 PM
                </p>
                <a href="tel:+59342345678" className="location-card__phone">
                  <i className="fas fa-phone"></i>
                  (04) 234-5678
                </a>
              </div>

              <div className="location-card">
                <div className="location-card__icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h3 className="location-card__city">Cuenca</h3>
                <p className="location-card__address">
                  Av. Ordóñez Lasso y<br />
                  Miguel Cordero, Esquina
                </p>
                <p className="location-card__hours">
                  <i className="far fa-clock"></i>
                  Lun-Sáb: 9:00 AM - 7:00 PM
                </p>
                <a href="tel:+59372345678" className="location-card__phone">
                  <i className="fas fa-phone"></i>
                  (07) 234-5678
                </a>
              </div>
            </div>

            <div className="online-store-cta">
              <i className="fas fa-laptop"></i>
              <h3>Compra Online y Retira en Tienda</h3>
              <p>Haz tu pedido desde cualquier lugar y retíralo en la sucursal más cercana</p>
              <Link to="/catalogo" className="btn btn--primary btn--lg">
                <i className="fas fa-shopping-bag"></i>
                Ver Catálogo Online
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AcercaPage;
