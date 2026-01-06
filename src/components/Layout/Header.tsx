import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarrito } from '../../context/CarritoContext';
import { useFavoritos } from '../../context/FavoritosContext';
import catalogoService from '../../services/catalogo.service';
import { Producto } from '../../types/catalogo.types';
import { getImagenProductoUrl } from '../../config/api.config';
import KeyboardShortcutsHelp from '../Common/KeyboardShortcutsHelp';
import './Header.css';

const Header: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargandoSugerencias, setCargandoSugerencias] = useState(false);
  const [mostrarAtajos, setMostrarAtajos] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCarrito();
  const { totalFavoritos } = useFavoritos();
  const navigate = useNavigate();

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar sugerencias cuando el usuario escribe
  useEffect(() => {
    const cargarSugerencias = async () => {
      if (busqueda.trim().length < 2) {
        setSugerencias([]);
        setMostrarSugerencias(false);
        return;
      }

      setCargandoSugerencias(true);
      try {
        const resultado = await catalogoService.getProductos({
          busqueda: busqueda.trim(),
          limite: 5
        });
        setSugerencias(resultado.productos);
        setMostrarSugerencias(true);
      } catch (error) {
        console.error('Error cargando sugerencias:', error);
        setSugerencias([]);
      } finally {
        setCargandoSugerencias(false);
      }
    };

    const timeoutId = setTimeout(cargarSugerencias, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.trim();
      setBusqueda('');
      setMostrarSugerencias(false);
      setSugerencias([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(`/catalogo?busqueda=${encodeURIComponent(terminoBusqueda)}`);
    }
  };

  const handleSeleccionarSugerencia = (producto: Producto) => {
    const nombreProducto = producto.descripcion || producto.nombre || '';
    setBusqueda('');
    setMostrarSugerencias(false);
    setSugerencias([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/catalogo?busqueda=${encodeURIComponent(nombreProducto)}`);
  };

  const handleCategoriaClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categorias = [
    { id: 1, nombre: 'Vino', icono: 'fa-wine-glass-alt' },
    { id: 2, nombre: 'Ron', icono: 'fa-cocktail' },
    { id: 3, nombre: 'Voodka', icono: 'fa-glass-martini-alt' },
    { id: 4, nombre: 'Whisky', icono: 'fa-glass-whiskey' },
    { id: 5, nombre: 'Cerveza', icono: 'fa-beer' },
    { id: 6, nombre: 'Cocteles', icono: 'fa-blender' },
  ];

  return (
    <header className="header" role="banner">
      {/* Main Header */}
      <nav className="header-main" aria-label="Navegación principal">
        <div className="container">
          <div className="header-main__wrapper">
            {/* Logo */}
            <div className="header-main__logo">
              <Link to="/" className="logo" aria-label="BARBOX - Ir al inicio">
                <i className="fas fa-wine-glass-alt logo__icon" aria-hidden="true"></i>
                <span className="logo__text">BARBOX</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="header-main__search" role="search" ref={searchRef}>
              <form className="search-form" onSubmit={handleBuscar}>
                <label htmlFor="search-input" className="sr-only">Buscar productos</label>
                <input
                  type="search"
                  id="search-input"
                  className="search-form__input"
                  placeholder="¿Qué estás buscando?"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onFocus={() => busqueda.trim().length >= 2 && setMostrarSugerencias(true)}
                  aria-describedby="search-hint"
                  autoComplete="off"
                />
                <span id="search-hint" className="sr-only">
                  Escriba el nombre del producto y presione Enter para buscar
                </span>
                <button type="submit" className="search-form__btn" aria-label="Buscar">
                  <i className="fas fa-search" aria-hidden="true"></i>
                </button>
              </form>

              {/* Sugerencias de búsqueda */}
              {mostrarSugerencias && (
                <div className="search-suggestions">
                  {cargandoSugerencias ? (
                    <div className="search-suggestions__loading">
                      <div className="spinner-small"></div>
                      <span>Buscando...</span>
                    </div>
                  ) : sugerencias.length > 0 ? (
                    <>
                      {sugerencias.map((producto) => (
                        <div
                          key={producto.id_producto}
                          className="search-suggestion"
                          onClick={() => handleSeleccionarSugerencia(producto)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSeleccionarSugerencia(producto);
                            }
                          }}
                        >
                          <img
                            src={getImagenProductoUrl(producto.imagen_url)}
                            alt={producto.descripcion || producto.nombre}
                            className="search-suggestion__image"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/40x40?text=Producto';
                            }}
                          />
                          <div className="search-suggestion__info">
                            <p className="search-suggestion__name">{producto.descripcion || producto.nombre}</p>
                            <p className="search-suggestion__details">
                              {producto.marca?.nombre} • ${Number(producto.precio_venta).toFixed(2)}
                            </p>
                          </div>
                          <i className="fas fa-arrow-right search-suggestion__arrow"></i>
                        </div>
                      ))}
                      <div className="search-suggestions__footer">
                        <button
                          onClick={handleBuscar}
                          className="search-suggestions__all"
                        >
                          Ver todos los resultados de "{busqueda}"
                        </button>
                      </div>
                    </>
                  ) : busqueda.trim().length >= 2 ? (
                    <div className="search-suggestions__empty">
                      <i className="fas fa-search"></i>
                      <p>No se encontraron productos</p>
                      <span>Intenta con otro término</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="header-main__actions" role="group" aria-label="Acciones de usuario">
              <button 
                onClick={() => setMostrarAtajos(true)}
                className="header-action" 
                aria-label="Ayuda y atajos de teclado"
                type="button"
              >
                <i className="fas fa-question-circle" aria-hidden="true"></i>
                <span className="header-action__text">Ayuda</span>
              </button>

              <Link to="/favoritos" className="header-action" aria-label={`Mis favoritos${totalFavoritos > 0 ? `, ${totalFavoritos} productos` : ''}`}>
                <i className="fas fa-heart" aria-hidden="true"></i>
                {totalFavoritos > 0 && (
                  <span className="header-action__badge" aria-hidden="true">{totalFavoritos}</span>
                )}
                <span className="header-action__text">Deseos</span>
              </Link>

              {isAuthenticated ? (
                <div className="header-action header-action--dropdown">
                  <div className="header-action__trigger">
                    <i className="fas fa-user" aria-hidden="true"></i>
                    <span className="header-action__text">{user?.cliente?.nombre1 || 'Cuenta'}</span>
                  </div>
                  <div className="header-dropdown" role="menu" aria-label="Menú de usuario">
                    <Link to="/mi-cuenta" className="header-dropdown__item" role="menuitem">
                      <i className="fas fa-user-circle" aria-hidden="true"></i> Mi Perfil
                    </Link>
                    <Link to="/mis-pedidos" className="header-dropdown__item" role="menuitem">
                      <i className="fas fa-box" aria-hidden="true"></i> Mis Pedidos
                    </Link>
                    <button onClick={logout} className="header-dropdown__item header-dropdown__item--danger" role="menuitem" type="button">
                      <i className="fas fa-sign-out-alt" aria-hidden="true"></i> Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="header-action" aria-label="Iniciar sesión">
                  <i className="fas fa-user" aria-hidden="true"></i>
                  <span className="header-action__text">Cuenta</span>
                </Link>
              )}

              <Link to="/carrito" className="header-action" aria-label={`Carrito de compras${totalItems > 0 ? `, ${totalItems} productos` : ', vacío'}`}>
                <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                {totalItems > 0 && (
                  <span className="header-action__badge" aria-hidden="true">{totalItems}</span>
                )}
                <span className="header-action__text">Carrito</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className={`header-main__toggle ${menuAbierto ? 'active' : ''}`}
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={menuAbierto}
              aria-controls="mobile-nav"
              type="button"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <nav
        className={`header-categories ${menuAbierto ? 'active' : ''}`}
        id="mobile-nav"
        aria-label="Navegación por categorías"
      >
        <div className="container">
          <ul className="categories-list" role="menubar">
            <li className="categories-list__item" role="none">
              <Link to="/" className="categories-list__link" role="menuitem">
                <i className="fas fa-home" aria-hidden="true"></i>
                <span>Inicio</span>
              </Link>
            </li>
            <li className="categories-list__item" role="none">
              <Link to="/promociones" className="categories-list__link" role="menuitem">
                <i className="fas fa-tags" aria-hidden="true"></i>
                <span>Promociones</span>
              </Link>
            </li>
            <li
              className="categories-list__item categories-list__item--dropdown"
              onMouseEnter={() => setCategoriasAbiertas(true)}
              onMouseLeave={() => setCategoriasAbiertas(false)}
              onFocus={() => setCategoriasAbiertas(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setCategoriasAbiertas(false);
                }
              }}
              role="none"
            >
              <Link
                to="/catalogo"
                className="categories-list__link"
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={categoriasAbiertas}
              >
                <i className="fas fa-wine-bottle" aria-hidden="true"></i>
                <span>Catálogo</span>
                <i className="fas fa-chevron-down" aria-hidden="true"></i>
              </Link>
              {categoriasAbiertas && (
                <div className="categories-dropdown" role="menu" aria-label="Subcategorías de catálogo">
                  <div className="categories-dropdown__grid">
                    {categorias.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/catalogo?categoriaId=${cat.id}`}
                        className="categories-dropdown__item"
                        role="menuitem"
                        onClick={handleCategoriaClick}
                      >
                        <i className={`fas ${cat.icono}`} aria-hidden="true"></i>
                        <span>{cat.nombre}</span>
                      </Link>
                    ))}
                  </div>
                  <Link to="/catalogo" className="categories-dropdown__all" role="menuitem" onClick={handleCategoriaClick}>
                    Ver todo el catálogo <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                </div>
              )}
            </li>
            <li className="categories-list__item" role="none">
              <Link to="/acerca" className="categories-list__link" role="menuitem">
                <i className="fas fa-info-circle" aria-hidden="true"></i>
                <span>Nosotros</span>
              </Link>
            </li>
            <li className="categories-list__item" role="none">
              <Link to="/contacto" className="categories-list__link" role="menuitem">
                <i className="fas fa-envelope" aria-hidden="true"></i>
                <span>Contacto</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Modal de Atajos de Teclado */}
      <KeyboardShortcutsHelp 
        isOpen={mostrarAtajos} 
        onClose={() => setMostrarAtajos(false)} 
      />
    </header>
  );
};

export default Header;
