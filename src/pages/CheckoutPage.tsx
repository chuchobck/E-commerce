import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { checkoutService } from '../services/checkout.service';
import { PuntoRetiro, MetodoPago } from '../types/checkout.types';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, limpiarCarrito } = useCarrito();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  
  const [puntosRetiro, setPuntosRetiro] = useState<PuntoRetiro[]>([]);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
  const [puntoRetiroSeleccionado, setPuntoRetiroSeleccionado] = useState('');
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');

  const carritoId = localStorage.getItem('barbox_cart_id');

  // Verificar autenticación y carrito
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!carritoId || !items || items.length === 0) {
      mostrarAlerta('No hay productos en el carrito', 'error');
      setTimeout(() => navigate('/carrito'), 2000);
      return;
    }

    cargarDatosCheckout();
  }, [isAuthenticated, carritoId, items, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const cargarDatosCheckout = async () => {
    try {
      setLoadingData(true);
      const [puntosData, metodosData] = await Promise.all([
        checkoutService.getPuntosRetiro(),
        checkoutService.getMetodosPago()
      ]);
      
      setPuntosRetiro(puntosData);
      setMetodosPago(metodosData);
      
      // Seleccionar primer punto de retiro y método de pago por defecto
      if (puntosData.length > 0) {
        setPuntoRetiroSeleccionado(puntosData[0].id);
      }
      if (metodosData.length > 0) {
        setMetodoPagoSeleccionado(metodosData[0].id);
      }
    } catch (error: any) {
      console.error('Error cargando datos de checkout:', error);
      mostrarAlerta('Error al cargar datos del checkout', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const mostrarAlerta = (mensaje: string, tipo: 'success' | 'error') => {
    setAlertMessage(mensaje);
    setAlertType(tipo);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleConfirmarCompra = async () => {
    if (!puntoRetiroSeleccionado) {
      mostrarAlerta('Por favor selecciona un punto de retiro', 'error');
      return;
    }

    if (!metodoPagoSeleccionado) {
      mostrarAlerta('Por favor selecciona un método de pago', 'error');
      return;
    }

    if (!carritoId) {
      mostrarAlerta('Error: No se encontró el carrito', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await checkoutService.procesarCheckout({
        carrito_id: carritoId,
        metodo_pago_id: metodoPagoSeleccionado,
        sucursal_retiro_id: puntoRetiroSeleccionado,
      });

      if (response.status === 'success') {
        mostrarAlerta('¡Compra realizada con éxito!', 'success');
        limpiarCarrito();
        
        // Redirigir a página de confirmación después de 2 segundos
        setTimeout(() => {
          navigate('/confirmacion-pedido', {
            state: { factura: response.data.factura }
          });
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error en checkout:', error);
      const mensaje = error.response?.data?.message || 'Error al procesar la compra';
      mostrarAlerta(mensaje, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Cargando datos del checkout...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalCarrito = items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="container">
          {/* Header */}
          <div className="checkout-header">
            <button 
              className="checkout-back-btn" 
              onClick={() => navigate('/carrito')}
              aria-label="Regresar al carrito"
            >
              <i className="fas fa-arrow-left"></i>
              Volver al carrito
            </button>
            <h1 className="checkout-title">
              <i className="fas fa-credit-card"></i>
              Confirmar Compra
            </h1>
          </div>

          {/* Indicador de progreso */}
          <div className="checkout-progress">
            <div className="progress-step completed">
              <span className="step-number">1</span>
              <span className="step-label">Carrito</span>
            </div>
            <div className="progress-line completed"></div>
            <div className="progress-step active">
              <span className="step-number">2</span>
              <span className="step-label">Checkout</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <span className="step-number">3</span>
              <span className="step-label">Confirmación</span>
            </div>
          </div>

          {/* Alertas */}
          {showAlert && (
            <div className={`alert alert-${alertType} show`}>
              <i className={`fas fa-${alertType === 'success' ? 'check' : 'exclamation'}-circle`}></i>
              {alertMessage}
            </div>
          )}

          <div className="checkout-wrapper">
            {/* Sección de Checkout */}
            <div className="checkout-form">
              
              {/* Punto de Retiro */}
              <div className="form-section">
                <h2><i className="fas fa-store"></i> Punto de Retiro</h2>
                <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                  Selecciona dónde retirarás tu pedido:
                </p>
                <div className="punto-retiro-list">
                  {puntosRetiro.length === 0 ? (
                    <p>No hay puntos de retiro disponibles</p>
                  ) : (
                    puntosRetiro.map((punto) => (
                      <label 
                        key={punto.id} 
                        className={`punto-retiro-option ${puntoRetiroSeleccionado === punto.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="puntoRetiro"
                          value={punto.id}
                          checked={puntoRetiroSeleccionado === punto.id}
                          onChange={(e) => setPuntoRetiroSeleccionado(e.target.value)}
                        />
                        <span className="punto-radio"></span>
                        <div className="punto-info">
                          <strong>{punto.nombre}</strong>
                          <p><i className="fas fa-map-marker-alt"></i> {punto.direccion}</p>
                          <p><i className="fas fa-city"></i> {punto.ciudad.nombre}</p>
                          {punto.horario && <p><i className="fas fa-clock"></i> {punto.horario}</p>}
                          {punto.telefono && <p><i className="fas fa-phone"></i> {punto.telefono}</p>}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Método de Pago */}
              <div className="form-section">
                <h2><i className="fas fa-credit-card"></i> Método de Pago</h2>
                <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                  Selecciona cómo pagarás:
                </p>
                <div className="metodo-pago-list">
                  {metodosPago.length === 0 ? (
                    <p>No hay métodos de pago disponibles</p>
                  ) : (
                    metodosPago.map((metodo) => (
                      <label 
                        key={metodo.id} 
                        className={`metodo-pago-option ${metodoPagoSeleccionado === metodo.id ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="metodoPago"
                          value={metodo.id}
                          checked={metodoPagoSeleccionado === metodo.id}
                          onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
                        />
                        <span className="metodo-radio"></span>
                        <div className="metodo-info">
                          <strong>{metodo.nombre}</strong>
                          {metodo.descripcion && <p>{metodo.descripcion}</p>}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Resumen del Pedido */}
            <div className="checkout-summary">
              <h2><i className="fas fa-shopping-cart"></i> Resumen del Pedido</h2>
              
              <div className="summary-items">
                {items?.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.producto.nombre}</span>
                      <span className="item-quantity">x{item.cantidad}</span>
                    </div>
                    <span className="item-price">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${totalCarrito.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>IVA (15%):</span>
                  <span>${(totalCarrito * 0.15).toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <strong>Total:</strong>
                  <strong>${(totalCarrito * 1.15).toFixed(2)}</strong>
                </div>
              </div>

              <button 
                className="btn-confirmar-compra"
                onClick={handleConfirmarCompra}
                disabled={isLoading || !puntoRetiroSeleccionado || !metodoPagoSeleccionado}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    <span>Confirmar Compra</span>
                  </>
                )}
              </button>

              <div className="security-notice">
                <i className="fas fa-lock"></i>
                <p>Transacción segura y encriptada</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default CheckoutPage;
