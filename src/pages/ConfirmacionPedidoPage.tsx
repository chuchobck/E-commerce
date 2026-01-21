import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import './ConfirmacionPedidoPage.css';

interface Factura {
  id: string;
  numero_factura: string;
  fecha_emision: Date;
  subtotal: number;
  iva: number;
  total: number;
  estado_pago: string;
  estado_entrega: string;
}

const ConfirmacionPedidoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const factura = location.state?.factura as Factura;

  useEffect(() => {
    if (!factura) {
      navigate('/');
    }
  }, [factura, navigate]);

  if (!factura) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="confirmacion-page">
        <div className="container">
          <div className="confirmacion-card">
            <div className="confirmacion-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            
            <h1>¡Compra Exitosa!</h1>
            <p className="confirmacion-subtitle">
              Tu pedido ha sido procesado correctamente
            </p>

            <div className="confirmacion-details">
              <div className="detail-row">
                <span className="detail-label">Número de Factura:</span>
                <span className="detail-value">{factura.numero_factura}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">
                  {new Date(factura.fecha_emision).toLocaleDateString('es-EC', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Estado de Pago:</span>
                <span className={`detail-value badge badge-${factura.estado_pago}`}>
                  {factura.estado_pago}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Estado de Entrega:</span>
                <span className={`detail-value badge badge-${factura.estado_entrega}`}>
                  {factura.estado_entrega}
                </span>
              </div>

              <div className="detail-divider"></div>

              <div className="detail-row">
                <span className="detail-label">Subtotal:</span>
                <span className="detail-value">${factura.subtotal.toFixed(2)}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">IVA:</span>
                <span className="detail-value">${factura.iva.toFixed(2)}</span>
              </div>

              <div className="detail-row total-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value">${factura.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="confirmacion-info">
              <i className="fas fa-info-circle"></i>
              <p>
                Recibirás un correo de confirmación con los detalles de tu pedido.
                Podrás retirar tu pedido en el punto seleccionado presentando tu número de factura.
              </p>
            </div>

            <div className="confirmacion-actions">
              <button 
                className="btn-primary"
                onClick={() => navigate('/mis-pedidos')}
              >
                <i className="fas fa-list"></i>
                Ver Mis Pedidos
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                <i className="fas fa-home"></i>
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ConfirmacionPedidoPage;
