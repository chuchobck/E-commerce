import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import './MisPedidosPage.css';

interface ItemPedido {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen?: string;
}

interface Pedido {
  id: string;
  numero: string;
  fecha: string;
  estado: 'pendiente' | 'procesando' | 'listo' | 'entregado' | 'cancelado';
  total: number;
  items: ItemPedido[];
  metodoPago: string;
  sucursal: string;
}

const MisPedidosPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<{ mensaje: string; tipo: 'success' | 'info' | 'error' } | null>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mis-pedidos' } });
    }
  }, [isAuthenticated, navigate]);

  // Cargar pedidos (simulado - en producción vendría de la API)
  useEffect(() => {
    // Intentar cargar el último pedido del localStorage
    const ultimoPedido = localStorage.getItem('ultimoPedido');
    
    const pedidosSimulados: Pedido[] = [];
    
    if (ultimoPedido) {
      const pedidoData = JSON.parse(ultimoPedido);
      pedidosSimulados.push({
        id: pedidoData.numero,
        numero: pedidoData.numero,
        fecha: pedidoData.fecha,
        estado: 'procesando',
        total: pedidoData.total,
        items: pedidoData.items.map((item: any) => ({
          id: item.producto?.id_producto || item.id,
          nombre: item.producto?.nombre || item.producto?.descripcion || 'Producto',
          cantidad: item.cantidad,
          precio: item.producto?.precio_venta || item.precio_venta || 0,
          imagen: item.producto?.imagen_url
        })),
        metodoPago: pedidoData.datos?.metodoPago || 'paypal',
        sucursal: pedidoData.datos?.sucursal || 'quito'
      });
    }
    
    // Agregar pedidos de ejemplo si no hay pedidos reales
    if (pedidosSimulados.length === 0) {
      pedidosSimulados.push(
        {
          id: 'PED-DEMO-001',
          numero: 'PED-DEMO-001',
          fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'entregado',
          total: 85.50,
          items: [
            { id: '1', nombre: 'Johnnie Walker Black Label', cantidad: 1, precio: 45.00 },
            { id: '2', nombre: 'Vino Casillero del Diablo', cantidad: 2, precio: 20.25 }
          ],
          metodoPago: 'paypal',
          sucursal: 'quito'
        },
        {
          id: 'PED-DEMO-002',
          numero: 'PED-DEMO-002',
          fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          estado: 'entregado',
          total: 124.99,
          items: [
            { id: '3', nombre: 'Champagne Moët & Chandon', cantidad: 1, precio: 89.99 },
            { id: '4', nombre: 'Absolut Vodka', cantidad: 1, precio: 35.00 }
          ],
          metodoPago: 'transferencia',
          sucursal: 'guayaquil'
        }
      );
    }
    
    setPedidos(pedidosSimulados);
  }, []);

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'info' | 'error') => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  const getEstadoInfo = (estado: string) => {
    const estados: Record<string, { label: string; color: string; icono: string }> = {
      pendiente: { label: 'Pendiente', color: '#FF9800', icono: 'fa-clock' },
      procesando: { label: 'Procesando', color: '#2196F3', icono: 'fa-cog fa-spin' },
      listo: { label: 'Listo para retirar', color: '#9C27B0', icono: 'fa-box' },
      entregado: { label: 'Entregado', color: '#4CAF50', icono: 'fa-check-circle' },
      cancelado: { label: 'Cancelado', color: '#f44336', icono: 'fa-times-circle' }
    };
    return estados[estado] || estados.pendiente;
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const obtenerNombreSucursal = (codigo: string) => {
    const sucursales: Record<string, string> = {
      quito: 'Quito - Av. Amazonas',
      guayaquil: 'Guayaquil - Malecón 2000',
      cuenca: 'Cuenca - Av. Ordóñez Lasso'
    };
    return sucursales[codigo] || codigo;
  };

  const handleRepetirPedido = (pedido: Pedido) => {
    // Agregar todos los items del pedido al carrito
    pedido.items.forEach(item => {
      const producto = {
        id_producto: item.id,
        nombre: item.nombre,
        precio_venta: item.precio,
        imagen_url: item.imagen,
        categoria: { id_categoria: 1, nombre: 'Licores' },
        marca: { id_marca: 1, nombre: 'Marca' },
        stock: 100,
        activo: true
      };
      
      for (let i = 0; i < item.cantidad; i++) {
        agregarAlCarrito(producto as any);
      }
    });
    
    mostrarNotificacion(`¡${pedido.items.length} producto(s) agregados al carrito!`, 'success');
    
    // Opcional: navegar al carrito después de un momento
    setTimeout(() => {
      navigate('/carrito');
    }, 1500);
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="mis-pedidos-page">
        {/* Notificación */}
        {notificacion && (
          <div className={`pedidos-notificacion pedidos-notificacion--${notificacion.tipo}`}>
            <i className={`fas fa-${notificacion.tipo === 'success' ? 'check-circle' : notificacion.tipo === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
            <span>{notificacion.mensaje}</span>
          </div>
        )}

        {/* Hero Section */}
        <section className="pedidos-hero">
          <div className="container">
            <div className="pedidos-hero__content">
              <i className="fas fa-box-open"></i>
              <div>
                <h1>Mis Pedidos</h1>
                <p>Revisa el historial y estado de tus compras</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pedidos-content">
          <div className="container">
            
            {/* Filtros */}
            <div className="pedidos-filtros">
              <button 
                className={`filtro-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('todos')}
              >
                Todos ({pedidos.length})
              </button>
              <button 
                className={`filtro-btn ${filtroEstado === 'procesando' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('procesando')}
              >
                <i className="fas fa-cog"></i> En proceso
              </button>
              <button 
                className={`filtro-btn ${filtroEstado === 'listo' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('listo')}
              >
                <i className="fas fa-box"></i> Listos
              </button>
              <button 
                className={`filtro-btn ${filtroEstado === 'entregado' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('entregado')}
              >
                <i className="fas fa-check"></i> Entregados
              </button>
            </div>

            {/* Lista de Pedidos */}
            {pedidosFiltrados.length === 0 ? (
              <div className="pedidos-vacio">
                <i className="fas fa-shopping-bag"></i>
                <h2>No tienes pedidos {filtroEstado !== 'todos' ? 'con este estado' : 'aún'}</h2>
                <p>Cuando realices una compra, aparecerá aquí</p>
                <Link to="/catalogo" className="btn-primary">
                  <i className="fas fa-shopping-cart"></i>
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              <div className="pedidos-lista">
                {pedidosFiltrados.map((pedido) => {
                  const estadoInfo = getEstadoInfo(pedido.estado);
                  const isExpanded = pedidoExpandido === pedido.id;
                  
                  return (
                    <article key={pedido.id} className={`pedido-card ${isExpanded ? 'expanded' : ''}`}>
                      {/* Header del pedido */}
                      <div 
                        className="pedido-card__header"
                        onClick={() => setPedidoExpandido(isExpanded ? null : pedido.id)}
                      >
                        <div className="pedido-info">
                          <div className="pedido-numero">
                            <span className="label">Pedido</span>
                            <span className="valor">#{pedido.numero}</span>
                          </div>
                          <div className="pedido-fecha">
                            <i className="fas fa-calendar-alt"></i>
                            {formatearFecha(pedido.fecha)}
                          </div>
                        </div>
                        
                        <div className="pedido-estado" style={{ '--estado-color': estadoInfo.color } as React.CSSProperties}>
                          <i className={`fas ${estadoInfo.icono}`}></i>
                          <span>{estadoInfo.label}</span>
                        </div>
                        
                        <div className="pedido-total">
                          <span className="label">Total</span>
                          <span className="valor">${pedido.total.toFixed(2)}</span>
                        </div>
                        
                        <button className="pedido-toggle" aria-label="Expandir detalles">
                          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        </button>
                      </div>
                      
                      {/* Detalles expandidos */}
                      {isExpanded && (
                        <div className="pedido-card__body">
                          {/* Información de retiro */}
                          <div className="pedido-retiro">
                            <h4><i className="fas fa-store"></i> Punto de retiro</h4>
                            <p>{obtenerNombreSucursal(pedido.sucursal)}</p>
                            <p className="metodo-pago">
                              <i className={`fab fa-${pedido.metodoPago === 'paypal' ? 'paypal' : 'university'}`}></i>
                              {pedido.metodoPago === 'paypal' ? 'PayPal' : 'Transferencia'}
                            </p>
                          </div>
                          
                          {/* Lista de productos */}
                          <div className="pedido-items">
                            <h4><i className="fas fa-wine-bottle"></i> Productos ({pedido.items.length})</h4>
                            <ul>
                              {pedido.items.map((item, index) => (
                                <li key={index} className="pedido-item">
                                  <div className="item-info">
                                    <span className="item-cantidad">{item.cantidad}x</span>
                                    <span className="item-nombre">{item.nombre}</span>
                                  </div>
                                  <span className="item-precio">${(item.precio * item.cantidad).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Acciones */}
                          <div className="pedido-acciones">
                            <button 
                              className="btn-repetir"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRepetirPedido(pedido);
                              }}
                            >
                              <i className="fas fa-redo"></i>
                              Repetir Pedido
                            </button>
                            
                            {pedido.estado === 'entregado' && (
                              <button className="btn-factura">
                                <i className="fas fa-file-invoice"></i>
                                Ver Factura
                              </button>
                            )}
                            
                            <a 
                              href="https://wa.me/593987654321?text=Hola, necesito ayuda con mi pedido " 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-ayuda"
                            >
                              <i className="fab fa-whatsapp"></i>
                              ¿Necesitas ayuda?
                            </a>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
            
            {/* Información adicional */}
            <div className="pedidos-info-extra">
              <div className="info-card">
                <i className="fas fa-clock"></i>
                <h3>Tiempos de preparación</h3>
                <p>Tu pedido estará listo en 24-48 horas hábiles</p>
              </div>
              <div className="info-card">
                <i className="fas fa-id-card"></i>
                <h3>Retiro en tienda</h3>
                <p>Presenta tu cédula y el número de pedido</p>
              </div>
              <div className="info-card">
                <i className="fab fa-whatsapp"></i>
                <h3>¿Dudas?</h3>
                <p>Contáctanos por WhatsApp para cualquier consulta</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MisPedidosPage;
