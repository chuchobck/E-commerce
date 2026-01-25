import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import { checkoutService } from '../services/checkout.service';

interface ProductoPedido {
  id_producto: number;
  descripcion: string;
  marca?: string;
  imagen_url?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Pedido {
  id_factura: string;
  fecha_emision: string;
  subtotal: number;
  total: number;
  estado: string;
  estado_texto: string;
  puede_anular: boolean;
  metodo_pago: string;
  productos: ProductoPedido[];
  cantidad_items: number;
}

const MisPedidosPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mis-pedidos' } });
      return;
    }
    cargarPedidos();
  }, [isAuthenticated, navigate]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await checkoutService.getMisPedidos();
      setPedidos(response.data);
    } catch (err: any) {
      console.error('Error cargando pedidos:', err);
      setError('Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colores: { [key: string]: string } = {
      'EMI': '#f39c12',   // Emitida - warning
      'PAG': '#27ae60',   // Pagada - success
      'ENT': '#2ecc71',   // Entregada - success
      'ANU': '#e74c3c'    // Anulada - danger
    };
    return colores[estado] || '#95a5a6';
  };

  const getEstadoBadgeStyle = (estado: string) => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'white',
    backgroundColor: getEstadoColor(estado)
  });

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ minHeight: '70vh', padding: '40px 20px', background: '#f5f7fa' }}>
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p>Cargando tus pedidos...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main style={{ minHeight: '70vh', padding: '40px 20px', background: '#f5f7fa' }}>
        <div className="container">
          <h1 style={{ marginBottom: '30px' }}>
            <i className="fas fa-shopping-bag"></i> Mis Compras
          </h1>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {pedidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2>No tienes compras aún</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Explora nuestro catálogo y realiza tu primera compra</p>
              <button onClick={() => navigate('/catalogo')} style={{ padding: '12px 30px', background: '#C75040', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
                Ver Productos
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
              {pedidos.map((pedido) => (
                <div key={pedido.id_factura} style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                  {/* Header del pedido */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#2A1716' }}>
                        <i className="fas fa-receipt" style={{ marginRight: '8px', color: '#C75040' }}></i>
                        Factura #{pedido.id_factura}
                      </h3>
                      <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9rem' }}>
                        <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                        {new Date(pedido.fecha_emision).toLocaleDateString('es-EC', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span style={getEstadoBadgeStyle(pedido.estado)}>
                      {pedido.estado_texto}
                    </span>
                  </div>

                  {/* Productos */}
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' }}>
                    <p style={{ fontWeight: 600, marginBottom: '10px', color: '#444' }}>
                      <i className="fas fa-box" style={{ marginRight: '8px' }}></i>
                      {pedido.cantidad_items} producto{pedido.cantidad_items !== 1 ? 's' : ''}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {pedido.productos.slice(0, 3).map((producto, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f9f9f9', padding: '8px 12px', borderRadius: '8px' }}>
                          {producto.imagen_url ? (
                            <img src={producto.imagen_url} alt={producto.descripcion} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                          ) : (
                            <div style={{ width: '40px', height: '40px', background: '#ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-wine-bottle" style={{ color: '#999' }}></i>
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{producto.descripcion}</p>
                            {producto.marca && <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{producto.marca}</p>}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>x{producto.cantidad}</p>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#C75040' }}>${producto.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {pedido.productos.length > 3 && (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                          +{pedido.productos.length - 3} producto(s) más...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer con totales */}
                  <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                        <i className="fas fa-credit-card" style={{ marginRight: '5px' }}></i>
                        {pedido.metodo_pago}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Subtotal: ${pedido.subtotal.toFixed(2)}</p>
                      <p style={{ margin: '5px 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#2A1716' }}>
                        Total: ${pedido.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MisPedidosPage;
