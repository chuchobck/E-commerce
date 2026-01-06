import React, { useState } from 'react';
import './FormularioPagoTarjeta.css';

interface DatosTarjeta {
  numero: string;
  titular: string;
  fechaExpiracion: string;
  cvv: string;
}

interface Props {
  onPagar: (datosTarjeta: DatosTarjeta) => Promise<void>;
  monto: number;
  isLoading: boolean;
}

const FormularioPagoTarjeta: React.FC<Props> = ({ onPagar, monto, isLoading }) => {
  const [datosTarjeta, setDatosTarjeta] = useState<DatosTarjeta>({
    numero: '',
    titular: '',
    fechaExpiracion: '',
    cvv: ''
  });

  const [errores, setErrores] = useState<Partial<DatosTarjeta>>({});

  // Formatear número de tarjeta (espacios cada 4 dígitos)
  const formatearNumeroTarjeta = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '');
    const grupos = soloNumeros.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : soloNumeros;
  };

  // Formatear fecha de expiración (MM/AA)
  const formatearFecha = (valor: string) => {
    const soloNumeros = valor.replace(/\D/g, '');
    if (soloNumeros.length >= 2) {
      return soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2, 4);
    }
    return soloNumeros;
  };

  const handleChange = (campo: keyof DatosTarjeta, valor: string) => {
    let valorFormateado = valor;

    if (campo === 'numero') {
      valorFormateado = formatearNumeroTarjeta(valor);
    } else if (campo === 'fechaExpiracion') {
      valorFormateado = formatearFecha(valor);
    } else if (campo === 'cvv') {
      valorFormateado = valor.replace(/\D/g, '').slice(0, 4);
    }

    setDatosTarjeta({ ...datosTarjeta, [campo]: valorFormateado });
    
    // Limpiar error del campo
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: undefined });
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<DatosTarjeta> = {};

    // Validar número de tarjeta (16 dígitos)
    const numeroLimpio = datosTarjeta.numero.replace(/\D/g, '');
    if (!numeroLimpio) {
      nuevosErrores.numero = 'Ingrese el número de tarjeta';
    } else if (numeroLimpio.length < 16) {
      nuevosErrores.numero = 'Número de tarjeta incompleto';
    }

    // Validar titular
    if (!datosTarjeta.titular.trim()) {
      nuevosErrores.titular = 'Ingrese el nombre del titular';
    } else if (datosTarjeta.titular.trim().length < 3) {
      nuevosErrores.titular = 'Nombre demasiado corto';
    }

    // Validar fecha de expiración
    if (!datosTarjeta.fechaExpiracion) {
      nuevosErrores.fechaExpiracion = 'Ingrese la fecha de expiración';
    } else {
      const partes = datosTarjeta.fechaExpiracion.split('/');
      if (partes.length !== 2) {
        nuevosErrores.fechaExpiracion = 'Formato inválido (MM/AA)';
      } else {
        const mes = parseInt(partes[0]);
        const año = parseInt('20' + partes[1]);
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const añoActual = hoy.getFullYear();

        if (mes < 1 || mes > 12) {
          nuevosErrores.fechaExpiracion = 'Mes inválido';
        } else if (año < añoActual || (año === añoActual && mes < mesActual)) {
          nuevosErrores.fechaExpiracion = 'Tarjeta vencida';
        }
      }
    }

    // Validar CVV (3-4 dígitos)
    if (!datosTarjeta.cvv) {
      nuevosErrores.cvv = 'Ingrese el CVV';
    } else if (datosTarjeta.cvv.length < 3) {
      nuevosErrores.cvv = 'CVV incompleto';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    await onPagar(datosTarjeta);
  };

  // Detectar tipo de tarjeta (básico)
  const getTipoTarjeta = () => {
    const numero = datosTarjeta.numero.replace(/\D/g, '');
    if (numero.startsWith('4')) return '💳 Visa';
    if (numero.startsWith('5')) return '💳 Mastercard';
    if (numero.startsWith('3')) return '💳 American Express';
    return '💳 Tarjeta';
  };

  return (
    <div className="formulario-pago-tarjeta">
      <div className="pago-header">
        <h3>💳 Pago con Tarjeta de Crédito/Débito</h3>
        <p className="monto-total">Total a pagar: <strong>${monto.toFixed(2)}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="tarjeta-form">
        {/* Número de tarjeta */}
        <div className="form-group">
          <label htmlFor="numero">
            {getTipoTarjeta()}
            <span className="requerido">*</span>
          </label>
          <input
            type="text"
            id="numero"
            value={datosTarjeta.numero}
            onChange={(e) => handleChange('numero', e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={errores.numero ? 'error' : ''}
            disabled={isLoading}
          />
          {errores.numero && <span className="error-message">{errores.numero}</span>}
        </div>

        {/* Titular */}
        <div className="form-group">
          <label htmlFor="titular">
            Nombre del Titular
            <span className="requerido">*</span>
          </label>
          <input
            type="text"
            id="titular"
            value={datosTarjeta.titular}
            onChange={(e) => handleChange('titular', e.target.value.toUpperCase())}
            placeholder="NOMBRE COMO APARECE EN LA TARJETA"
            className={errores.titular ? 'error' : ''}
            disabled={isLoading}
          />
          {errores.titular && <span className="error-message">{errores.titular}</span>}
        </div>

        {/* Fecha y CVV en línea */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fechaExpiracion">
              Fecha de Expiración
              <span className="requerido">*</span>
            </label>
            <input
              type="text"
              id="fechaExpiracion"
              value={datosTarjeta.fechaExpiracion}
              onChange={(e) => handleChange('fechaExpiracion', e.target.value)}
              placeholder="MM/AA"
              maxLength={5}
              className={errores.fechaExpiracion ? 'error' : ''}
              disabled={isLoading}
            />
            {errores.fechaExpiracion && <span className="error-message">{errores.fechaExpiracion}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cvv">
              CVV/CVC
              <span className="requerido">*</span>
            </label>
            <input
              type="text"
              id="cvv"
              value={datosTarjeta.cvv}
              onChange={(e) => handleChange('cvv', e.target.value)}
              placeholder="123"
              maxLength={4}
              className={errores.cvv ? 'error' : ''}
              disabled={isLoading}
            />
            {errores.cvv && <span className="error-message">{errores.cvv}</span>}
            <small className="help-text">3-4 dígitos al reverso</small>
          </div>
        </div>

        {/* Botón de pago */}
        <button
          type="submit"
          className="btn-pagar"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Procesando...' : `💳 Pagar $${monto.toFixed(2)}`}
        </button>

        {/* Nota de seguridad */}
        <div className="nota-seguridad">
          <small>🔒 Tus datos están protegidos con encriptación SSL</small>
        </div>
      </form>
    </div>
  );
};

export default FormularioPagoTarjeta;
