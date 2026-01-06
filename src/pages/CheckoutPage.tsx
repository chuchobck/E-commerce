import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ConfirmModal from '../components/Common/ConfirmModal';
import FormularioPagoTarjeta from '../components/Checkout/FormularioPagoTarjeta';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { crearPago, pagarConTarjeta } from '../services/pago.service';
import { crearFactura } from '../services/factura.service';
import './CheckoutPage.css';

interface PedidoData {
  id_pedido: string;
  items: any[];
  total: number;
  fecha: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { limpiarCarrito } = useCarrito();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [pedidoData, setPedidoData] = useState<PedidoData | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<'PAYPAL' | 'TARJETA'>('PAYPAL');
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState('quito');

  // Lista de sucursales disponibles
  const sucursales = [
    { id: 'quito', nombre: 'Quito - Av. Amazonas y Naciones Unidas' },
    { id: 'guayaquil', nombre: 'Guayaquil - Malecón 2000, Local 15' },
    { id: 'cuenca', nombre: 'Cuenca - Av. Ordóñez Lasso 123' },
  ];

  // Cargar pedido desde localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }

    const pedidoGuardado = localStorage.getItem('pedidoActual');
    if (!pedidoGuardado) {
      console.warn('⚠️ No hay pedido activo, redirigiendo al carrito');
      navigate('/carrito');
      return;
    }

    const data = JSON.parse(pedidoGuardado) as PedidoData;
    console.log('📦 Pedido cargado:', data);
    setPedidoData(data);
  }, [isAuthenticated, navigate]);

  const mostrarAlerta = (mensaje: string, tipo: 'success' | 'error') => {
    setAlertMessage(mensaje);
    setAlertType(tipo);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmarCancelacion = () => {
    setShowCancelModal(false);
    localStorage.removeItem('pedidoActual');
    navigate('/carrito');
  };

  if (!pedidoData) {
    return (
      <>
        <Header />
        <main className="checkout-page">
          <div className="container">
            <div className="loading-screen">
              <div className="spinner"></div>
              <p>Cargando pedido...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              Confirmar Pago
            </h1>
          </div>

          {/* Indicador de progreso */}
          <div className="checkout-progress">
            <div className="progress-step completed">
              <span className="step-number">1</span>
              <span className="step-label">Carrito</span>
            </div>
            <div className="progress-line completed"></div>
            <div className="progress-step completed">
              <span className="step-number">2</span>
              <span className="step-label">Pedido</span>
            </div>
            <div className="progress-line completed"></div>
            <div className="progress-step active">
              <span className="step-number">3</span>
              <span className="step-label">Pago</span>
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
            {/* Sección de Pago */}
            <div className="checkout-form">
              <div className="form-section">
                <h2><i className="fas fa-check-circle" style={{ color: '#4CAF50' }}></i> Pedido Creado</h2>
                <div className="info-box-green">
                  <p><strong>N° Pedido:</strong> {pedidoData.id_pedido}</p>
                  <p><strong>Fecha:</strong> {new Date(pedidoData.fecha).toLocaleString('es-EC')}</p>
                  <p style={{ marginTop: '10px', fontSize: '14px' }}>
                    <i className="fas fa-info-circle"></i> Tu pedido ha sido creado. Completa el pago para finalizar tu compra.
                  </p>
                </div>
              </div>

              {/* Sección de Sucursal */}
              <div className="form-section">
                <h2><i className="fas fa-store"></i> Sucursal de Retiro</h2>
                <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                  Selecciona la sucursal donde retirarás tu pedido:
                </p>
                <div className="sucursal-selector">
                  {sucursales.map((sucursal) => (
                    <label 
                      key={sucursal.id} 
                      className={`sucursal-option ${sucursalSeleccionada === sucursal.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="sucursal"
                        value={sucursal.id}
                        checked={sucursalSeleccionada === sucursal.id}
                        onChange={(e) => setSucursalSeleccionada(e.target.value)}
                      />
                      <span className="sucursal-radio"></span>
                      <span className="sucursal-info">
                        <i className="fas fa-map-marker-alt"></i>
                        {sucursal.nombre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                {/* Tabs de métodos de pago */}
                <div className="payment-tabs">
                  <button
                    className={`payment-tab ${metodoSeleccionado === 'PAYPAL' ? 'active' : ''}`}
                    onClick={() => setMetodoSeleccionado('PAYPAL')}
                  >
                    <i className="fab fa-paypal"></i> PayPal
                  </button>
                  <button
                    className={`payment-tab ${metodoSeleccionado === 'TARJETA' ? 'active' : ''}`}
                    onClick={() => setMetodoSeleccionado('TARJETA')}
                  >
                    <i className="fas fa-credit-card"></i> Tarjeta de Crédito/Débito
                  </button>
                </div>

                {/* Contenido según método seleccionado */}
                {metodoSeleccionado === 'PAYPAL' ? (
                  <div className="payment-content">
                    <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
                      Haz clic en el botón de PayPal para completar tu compra de forma segura.
                    </p>
                    
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
                        disabled={isLoading}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [{
                              amount: {
                                currency_code: 'USD',
                                value: pedidoData.total.toFixed(2),
                              },
                              description: `Pedido ${pedidoData.id_pedido} - BARBOX`,
                            }],
                          });
                        }}
                    onApprove={async (data, actions) => {
                      setIsLoading(true);
                      try {
                        const details = await actions.order?.capture();
                        const transactionId = details?.id;

                        console.log('💳 Pago aprobado:', transactionId);

                        // 1. Registrar el pago
                        await crearPago({
                          pedidoId: pedidoData.id_pedido,
                          metodo: 'PAYPAL',
                          monto: pedidoData.total,
                          referencia: transactionId,
                        });
                        console.log('✅ Pago registrado');

                        // 2. Crear factura usando el SP sp_factura_crear
                        let facturaData = null;
                        if (user?.cliente?.id_cliente) {
                          const facturaResponse = await crearFactura({
                            clienteId: user.cliente.id_cliente,
                            canal: 'WEB',
                            pedidoId: pedidoData.id_pedido,
                          });
                          facturaData = facturaResponse.data;
                          console.log('📄 Factura creada:', facturaData);
                        }

                        // 3. Guardar datos para la página de confirmación
                        const confirmacionData = {
                          pedidoId: pedidoData.id_pedido,
                          factura: facturaData,
                          transaccion: transactionId,
                          items: pedidoData.items,
                          total: pedidoData.total,
                          fecha: new Date().toISOString(),
                          email: user?.email,
                          sucursal: sucursalSeleccionada,
                        };
                        localStorage.setItem('confirmacionPago', JSON.stringify(confirmacionData));
                        
                        // Guardar también en formato antiguo para compatibilidad
                        const pedidoConfirmado = {
                          numero: pedidoData.id_pedido,
                          fecha: pedidoData.fecha,
                          usuario: user,
                          datos: { email: user?.email, sucursal: sucursalSeleccionada },
                          items: pedidoData.items,
                          total: pedidoData.total,
                        };
                        localStorage.setItem('ultimoPedido', JSON.stringify(pedidoConfirmado));

                        // 4. Limpiar datos temporales y forzar nuevo carrito
                        localStorage.removeItem('pedidoActual');
                        localStorage.removeItem('carritoId'); // 🔄 Ahora sí limpiar - pago confirmado
                        await limpiarCarrito();

                        // 5. Redirigir a confirmación
                        mostrarAlerta('¡Pago exitoso! Redirigiendo...', 'success');
                        setTimeout(() => {
                          navigate(`/pedido-confirmado?pedido=${pedidoData.id_pedido}`, { replace: true });
                        }, 1000);

                      } catch (error: any) {
                        console.error('❌ Error en post-pago:', error);
                        const mensaje = error.response?.data?.message || 'Error procesando el pago. Contacte soporte.';
                        
                        // Si el error es que ya tiene factura, limpiar y redirigir
                        if (mensaje.includes('factura')) {
                          localStorage.removeItem('pedidoActual');
                          localStorage.removeItem('barbox_carrito_id');
                          localStorage.removeItem('barbox_carrito_id');
                          localStorage.removeItem('carritoId');
                          mostrarAlerta('Este pedido ya fue procesado. Redirigiendo al carrito...', 'error');
                          setTimeout(() => {
                            navigate('/carrito', { replace: true });
                          }, 2000);
                        } else {
                          mostrarAlerta(mensaje, 'error');
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    onError={(err) => {
                      console.error('❌ Error en PayPal:', err);
                      mostrarAlerta('Error con PayPal. Intente nuevamente.', 'error');
                    }}
                    onCancel={() => {
                      mostrarAlerta('Pago cancelado. Puedes intentarlo de nuevo.', 'error');
                    }}
                  />
                    </div>
                  </div>
                ) : (
                  <div className="payment-content">
                    <FormularioPagoTarjeta
                      monto={pedidoData.total}
                      isLoading={isLoading}
                      onPagar={async (datosTarjeta) => {
                        setIsLoading(true);
                        try {
                          console.log('💳 Procesando pago con tarjeta...');

                          // 1. Procesar pago con tarjeta
                          const pagoResponse = await pagarConTarjeta({
                            pedidoId: pedidoData.id_pedido,
                            datosTarjeta
                          });
                          
                          const { referencia, ultimosDigitos } = pagoResponse.data;
                          console.log('✅ Pago con tarjeta aprobado:', referencia);

                          // 2. Crear factura
                          let facturaData = null;
                          if (user?.cliente?.id_cliente) {
                            const facturaResponse = await crearFactura({
                              clienteId: user.cliente.id_cliente,
                              canal: 'WEB',
                              pedidoId: pedidoData.id_pedido,
                            });
                            facturaData = facturaResponse.data;
                            console.log('📄 Factura creada:', facturaData);
                          }

                          // 3. Guardar datos para confirmación
                          const confirmacionData = {
                            pedidoId: pedidoData.id_pedido,
                            factura: facturaData,
                            transaccion: referencia,
                            metodoPago: 'TARJETA',
                            ultimosDigitos,
                            items: pedidoData.items,
                            total: pedidoData.total,
                            fecha: new Date().toISOString(),
                            email: user?.email,
                            sucursal: sucursalSeleccionada,
                          };
                          localStorage.setItem('confirmacionPago', JSON.stringify(confirmacionData));
                          
                          const pedidoConfirmado = {
                            numero: pedidoData.id_pedido,
                            fecha: pedidoData.fecha,
                            usuario: user,
                            datos: { email: user?.email, sucursal: sucursalSeleccionada },
                            items: pedidoData.items,
                            total: pedidoData.total,
                          };
                          localStorage.setItem('ultimoPedido', JSON.stringify(pedidoConfirmado));

                          // 4. Limpiar datos y forzar nuevo carrito
                          localStorage.removeItem('pedidoActual');
                          localStorage.removeItem('barbox_carrito_id');
                          localStorage.removeItem('carritoId');
                          await limpiarCarrito();

                          // 5. Redirigir a confirmación
                          mostrarAlerta('¡Pago exitoso! Redirigiendo...', 'success');
                          setTimeout(() => {
                            navigate(`/pedido-confirmado?pedido=${pedidoData.id_pedido}`, { replace: true });
                          }, 1000);

                        } catch (error: any) {
                          console.error('❌ Error en pago con tarjeta:', error);
                          const mensaje = error.response?.data?.message || 'Error procesando el pago. Intente nuevamente.';
                          
                          // Si el error es que ya tiene factura, limpiar y redirigir
                          if (mensaje.includes('factura')) {
                            localStorage.removeItem('pedidoActual');
                            localStorage.removeItem('carritoId');
                            mostrarAlerta('Este pedido ya fue procesado. Redirigiendo al carrito...', 'error');
                            setTimeout(() => {
                              navigate('/carrito', { replace: true });
                            }, 2000);
                          } else {
                            mostrarAlerta(mensaje, 'error');
                          }
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    />
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: '30px' }}>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn btn--outline"
                    disabled={isLoading}
                  >
                    <i className="fas fa-times"></i> Cancelar Compra
                  </button>
                </div>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="order-summary">
              <h2><i className="fas fa-shopping-cart"></i> Resumen del Pedido</h2>

              {pedidoData.items.map((item: any) => (
                <div key={item.producto?.id_producto || item.id_producto} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{item.producto?.nombre || item.producto?.descripcion || 'Producto'}</span>
                    <span className="item-qty">x{item.cantidad}</span>
                  </div>
                  <div className="item-price">
                    ${((item.precio_venta || item.producto?.precio_venta || 0) * item.cantidad).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="summary-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${pedidoData.total.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total a Pagar:</span>
                <span>${pedidoData.total.toFixed(2)}</span>
              </div>

              <div className="trust-badges">
                <div className="badge">
                  <i className="fas fa-lock"></i>
                  Pago Seguro
                </div>
                <div className="badge">
                  <i className="fas fa-check-circle"></i>
                  Garantía
                </div>
                <div className="badge">
                  <i className="fas fa-headset"></i>
                  Soporte 24/7
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loader */}
      {isLoading && (
        <div className="loader show">
          <div className="spinner"></div>
        </div>
      )}

      <Footer />

      {/* Modal Confirmar Cancelación */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmarCancelacion}
        type="warning"
        title="¿Cancelar la compra?"
        message="Si cancelas ahora, tu pedido quedará pendiente. Podrás completar el pago más tarde desde tu historial de pedidos."
        confirmText="Sí, cancelar"
        cancelText="Continuar con el pago"
        icon="fa-exclamation-triangle"
      />
    </>
  );
};

export default CheckoutPage;
