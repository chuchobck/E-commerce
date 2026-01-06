import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import './FloatingCart.css';

const FloatingCart: React.FC = () => {
  const { totalItems } = useCarrito();
  const navigate = useNavigate();
  const location = useLocation();

  // Rutas donde NO debe aparecer el carrito flotante
  const rutasOcultas = ['/carrito', '/checkout', '/login', '/register', '/pedido-confirmado'];
  const debeOcultarse = rutasOcultas.some(ruta => location.pathname.startsWith(ruta));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/carrito');
  };

  // No mostrar si no hay items o estamos en ruta oculta
  if (totalItems === 0 || debeOcultarse) return null;

  return (
    <div className="floating-cart" aria-live="polite">
      <button
        className="floating-cart__trigger"
        onClick={handleClick}
        aria-label={`Ver carrito con ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`}
        title={`Ver carrito (${totalItems})`}
      >
        <i className="fas fa-shopping-cart" aria-hidden="true"></i>
        {totalItems > 0 && (
          <span className="floating-cart__badge">{totalItems}</span>
        )}
      </button>
    </div>
  );
};

export default FloatingCart;
