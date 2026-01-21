import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import { checkoutService } from '../services/checkout.service';

interface Pedido {
  id: string;
  numero_factura: string;
  fecha_emision: string;
  total: number;
  estado_pago: string;
  estado_entrega: string;
  sucursal_retiro?: {
    nombre: string;
    direccion: string;
  };
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
      'PENDIENTE': 'warning',
      'PAGADO': 'success',
      'PREPARACION': 'info',
      'LISTO': 'success',
      'ENTREGADO': 'success',
      'CANCELADO': 'danger'
    };
    return colores[estado] || 'secondary';
  };

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
            <i className="fas fa-shopping-bag"></i> Mis Pedidos
          </h1>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {pedidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2>No tienes pedidos aún</h2>
              <button onClick={() => navigate('/')}>
                Ir a Comprar
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
              {pedidos.map((pedido) => (
                <div key={pedido.id} style={{ background: 'white', padding: '25px', borderRadius: '15px' }}>
                  <h3>Pedido #{pedido.numero_factura}</h3>
                  <p>{new Date(pedido.fecha_emision).toLocaleDateString('es-EC')}</p>
                  <p>${pedido.total.toFixed(2)}</p>
                  <p>Pago: {pedido.estado_pago}</p>
                  <p>Entrega: {pedido.estado_entrega}</p>
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
