import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PedidoConfirmadoPage.css';

interface Pedido {
  numero: string;
  fecha: string;
  usuario: any;
  datos: any;
  items: any[];
  total: number;
}

interface ConfirmacionData {
  pedidoId: string;
  factura: {
    id_factura: string;
    subtotal: number;
    total: number;
  } | null;
  transaccion: string;
  items: any[];
  total: number;
  fecha: string;
  email: string;
  sucursal: string;
}

const PedidoConfirmadoPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [confirmacion, setConfirmacion] = useState<ConfirmacionData | null>(null);
  const facturaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const numeroPedido = searchParams.get('pedido');
    
    console.log('🔍 PedidoConfirmadoPage cargado');
    console.log('📄 Número de pedido del query:', numeroPedido);
    
    if (!numeroPedido) {
      console.warn('⚠️ No hay número de pedido, redirigiendo a inicio');
      navigate('/');
      return;
    }

    // Cargar datos de confirmación (nuevo formato con factura)
    const confirmacionGuardada = localStorage.getItem('confirmacionPago');
    if (confirmacionGuardada) {
      const confirmacionData = JSON.parse(confirmacionGuardada) as ConfirmacionData;
      console.log('✅ Confirmación cargada:', confirmacionData);
      setConfirmacion(confirmacionData);
    }

    // Cargar datos del pedido desde localStorage (compatibilidad)
    const pedidoGuardado = localStorage.getItem('ultimoPedido');
    console.log('📦 Pedido guardado en localStorage:', pedidoGuardado ? 'SÍ' : 'NO');
    
    if (pedidoGuardado) {
      const pedidoData = JSON.parse(pedidoGuardado);
      console.log('✅ Pedido cargado:', pedidoData);
      setPedido(pedidoData);
      
      // Limpiar carrito después de 2 segundos
      setTimeout(() => {
        console.log('🗑️ Limpiando datos del localStorage');
        localStorage.removeItem('carritoItems');
        localStorage.removeItem('confirmacionPago');
      }, 2000);
    } else {
      console.error('❌ No se encontró pedido guardado, redirigiendo a inicio');
      navigate('/');
    }

    // Prevenir que el usuario regrese al checkout
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [searchParams, navigate]);

  if (!pedido) {
    return null;
  }

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-EC', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const obtenerNombreSucursal = (codigo: string) => {
    const sucursales: { [key: string]: string } = {
      quito: 'Quito - Av. Amazonas y Naciones Unidas',
      guayaquil: 'Guayaquil - Malecón 2000, Local 15',
      cuenca: 'Cuenca - Av. Ordóñez Lasso 123',
    };
    return sucursales[codigo] || codigo;
  };

  const obtenerMetodoPago = (metodo: string) => {
    const metodos: { [key: string]: string } = {
      paypal: 'PayPal',
      transferencia: 'Transferencia Bancaria',
    };
    return metodos[metodo] || metodo;
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargarPDF = () => {
    // Crear contenido HTML para descargar
    const contenido = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Factura ${pedido.numero} - BARBOX</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
    .factura { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2A1716; padding-bottom: 20px; margin-bottom: 30px; }
    .logo h1 { font-size: 28px; color: #C75040; margin: 0; }
    .logo p { color: #666; font-size: 12px; }
    .info { text-align: right; }
    .info h2 { font-size: 18px; color: #2A1716; margin-bottom: 10px; }
    .info p { font-size: 13px; margin: 5px 0; }
    .section { margin-bottom: 25px; }
    .section h3 { font-size: 14px; color: #C75040; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; margin-bottom: 15px; }
    .row { display: flex; gap: 30px; }
    .col { flex: 1; }
    .col p { font-size: 13px; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #2A1716; color: white; padding: 12px; text-align: left; font-size: 12px; }
    td { padding: 12px; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .totales { max-width: 300px; margin-left: auto; margin-top: 20px; background: #f9f9f9; padding: 15px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .total-final { border-top: 2px solid #2A1716; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: bold; color: #C75040; }
    .instrucciones { background: #f9f9f9; padding: 15px; border-radius: 8px; }
    .instrucciones ul { list-style: none; padding-left: 0; }
    .instrucciones li { padding: 6px 0; font-size: 13px; }
    .instrucciones li:before { content: "•"; color: #C75040; margin-right: 10px; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="factura">
    <div class="header">
      <div class="logo">
        <h1>BARBOX</h1>
        <p>Licorería Premium</p>
      </div>
      <div class="info">
        <h2>COMPROBANTE DE COMPRA</h2>
        <p><strong>N°:</strong> ${pedido.numero}</p>
        <p><strong>Fecha:</strong> ${formatearFecha(pedido.fecha)}</p>
      </div>
    </div>
    
    <div class="section">
      <div class="row">
        <div class="col">
          <h3>DATOS DEL CLIENTE</h3>
          <p><strong>Cliente:</strong> ${pedido.usuario?.cliente?.nombre1 || ''} ${pedido.usuario?.cliente?.apellido1 || ''}</p>
          <p><strong>Email:</strong> ${confirmacion?.email || pedido.datos?.email || 'N/A'}</p>
          ${pedido.usuario?.cliente?.celular ? `<p><strong>Celular:</strong> ${pedido.usuario.cliente.celular}</p>` : ''}
          ${confirmacion?.transaccion ? `<p><strong>Transacción PayPal:</strong> ${confirmacion.transaccion}</p>` : ''}
          ${confirmacion?.factura?.id_factura ? `<p><strong>N° Factura:</strong> ${confirmacion.factura.id_factura}</p>` : ''}
        </div>
        </div>
        <div class="col">
          <h3>SUCURSAL DE RETIRO</h3>
          <p>${obtenerNombreSucursal(confirmacion?.sucursal || pedido.datos?.sucursal || '')}</p>
          <p><strong>Método de pago:</strong> PayPal</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>DETALLE DE PRODUCTOS</h3>
      <table>
        <thead>
          <tr>
            <th>Cant.</th>
            <th>Descripción</th>
            <th class="text-right">P. Unit.</th>
            <th class="text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.items.map((item: any) => `
            <tr>
              <td class="text-center">${item.cantidad}</td>
              <td>${item.producto?.nombre || item.producto?.descripcion || 'Producto'}</td>
              <td class="text-right">$${Number(item.producto?.precio_venta || 0).toFixed(2)}</td>
              <td class="text-right">$${(Number(item.producto?.precio_venta || 0) * item.cantidad).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="totales">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${(confirmacion?.factura?.subtotal || pedido.total).toFixed(2)}</span>
        </div>
        ${confirmacion?.factura ? `<div class="total-row">
          <span>IVA (15%):</span>
          <span>$${((confirmacion.factura.total || 0) - (confirmacion.factura.subtotal || 0)).toFixed(2)}</span>
        </div>` : ''}
        <div class="total-row total-final">
          <span>TOTAL PAGADO:</span>
          <span>$${(confirmacion?.factura?.total || pedido.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>INSTRUCCIONES IMPORTANTES</h3>
      <div class="instrucciones">
        <ul>
          <li>Su pedido estará listo para retirar en 24-48 horas hábiles</li>
          <li>Recibirá una notificación por email cuando esté disponible</li>
          <li>Debe presentar este comprobante y su cédula al momento del retiro</li>
          <li>El pedido se mantendrá reservado por 7 días</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p>Para consultas: info@barbox.com | Tel: +593 99 173 0968</p>
      <p>¡Gracias por su compra!</p>
    </div>
  </div>
</body>
</html>`;

    // Crear blob y descargar
    const blob = new Blob([contenido], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${pedido.numero}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <main className="factura-page">
        {/* Mensaje de Éxito */}
        <section className="factura-success">
          <div className="container">
            <div className="success-icon">
              <i className="fas fa-check"></i>
            </div>
            <h1>¡Compra Realizada con Éxito!</h1>
            <p>Tu pedido ha sido procesado correctamente. A continuación encontrarás tu comprobante de compra.</p>
          </div>
        </section>

        {/* Factura */}
        <section className="factura-section">
          <div className="container">
            <div className="factura-container" ref={facturaRef}>
              
              {/* Header de la factura */}
              <div className="factura-header">
                <div className="factura-logo">
                  <h1>BARBOX</h1>
                  <p>Licorería Premium</p>
                </div>
                <div className="factura-info">
                  <h2>COMPROBANTE DE COMPRA</h2>
                  <p><strong>N°:</strong> {pedido.numero}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(pedido.fecha)}</p>
                </div>
              </div>

              {/* Datos del cliente y entrega */}
              <div className="factura-datos">
                <div className="factura-row">
                  <div className="factura-col">
                    <h3><i className="fas fa-user"></i> Datos del Cliente</h3>
                    <div className="factura-col-content">
                      <p><strong>Cliente:</strong> {pedido.usuario?.cliente?.nombre1 || ''} {pedido.usuario?.cliente?.apellido1 || ''}</p>
                      <p><strong>Email:</strong> {confirmacion?.email || pedido.datos?.email || 'N/A'}</p>
                      {pedido.usuario?.cliente?.celular && (
                        <p><strong>Celular:</strong> {pedido.usuario?.cliente?.celular}</p>
                      )}
                      {confirmacion?.transaccion && (
                        <p><strong>Transacción PayPal:</strong> {confirmacion.transaccion}</p>
                      )}
                      {confirmacion?.factura?.id_factura && (
                        <p><strong>N° Factura:</strong> {confirmacion.factura.id_factura}</p>
                      )}
                    </div>
                  </div>
                  <div className="factura-col">
                    <h3><i className="fas fa-store"></i> Sucursal de Retiro</h3>
                    <div className="factura-col-content">
                      <p><i className="fas fa-map-marker-alt"></i> {obtenerNombreSucursal(confirmacion?.sucursal || pedido.datos?.sucursal || '')}</p>
                      <p><strong>Método de pago:</strong> PayPal</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de productos */}
              <div className="factura-productos">
                <h3><i className="fas fa-shopping-bag"></i> Detalle de Productos</h3>
                <div className="factura-table-wrapper">
                  <table className="factura-table">
                    <thead>
                      <tr>
                        <th>Cant.</th>
                        <th>Descripción</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedido.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="text-center">{item.cantidad}</td>
                          <td>{item.producto?.nombre || item.producto?.descripcion || 'Producto'}</td>
                          <td className="text-right">${Number(item.producto?.precio_venta || 0).toFixed(2)}</td>
                          <td className="text-right">${(Number(item.producto?.precio_venta || 0) * item.cantidad).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="factura-totales-section">
                <div className="factura-totales">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>${(confirmacion?.factura?.subtotal || pedido.total).toFixed(2)}</span>
                  </div>
                  {confirmacion?.factura && (
                    <div className="total-row">
                      <span>IVA (15%):</span>
                      <span>${((confirmacion.factura.total || 0) - (confirmacion.factura.subtotal || 0)).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="total-row total-final">
                    <span>TOTAL PAGADO:</span>
                    <span>${(confirmacion?.factura?.total || pedido.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Pie de página de la factura */}
              <div className="factura-footer-info">
                <p><i className="fas fa-envelope"></i> info@barbox.com | <i className="fas fa-phone"></i> +593 99 173 0968</p>
                <p className="gracias">¡Gracias por su compra!</p>
              </div>

            </div>

            {/* Acciones */}
            <div className="factura-actions">
              <button onClick={handleImprimir} className="btn-factura btn-primary">
                <i className="fas fa-print"></i>
                Imprimir
              </button>
              <button onClick={handleDescargarPDF} className="btn-factura btn-download">
                <i className="fas fa-download"></i>
                Descargar
              </button>
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/'); }} className="btn-factura btn-secondary">
                <i className="fas fa-home"></i>
                Ir al Inicio
              </button>
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/catalogo'); }} className="btn-factura btn-outline">
                <i className="fas fa-shopping-bag"></i>
                Seguir Comprando
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default PedidoConfirmadoPage;
