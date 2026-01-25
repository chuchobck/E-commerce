import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';
import './MiCuentaPage.css';

const MiCuentaPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad'>('perfil');
  const [editMode, setEditMode] = useState(false);
  
  // Estado del formulario de perfil - Se sincroniza con los datos del usuario
  const [formData, setFormData] = useState({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    celular: '',
    email: '',
    direccion: '',
    ruc_cedula: '',
    id_ciudad: '',
  });

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirm: '',
  });
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ Sincronizar datos del usuario al cargar o cuando cambie el usuario
  React.useEffect(() => {
    if (user && user.cliente) {
      setFormData({
        nombre1: user.cliente.nombre1 || '',
        nombre2: user.cliente.nombre2 || '',
        apellido1: user.cliente.apellido1 || '',
        apellido2: user.cliente.apellido2 || '',
        telefono: user.cliente.telefono || '',
        celular: user.cliente.celular || '',
        email: user.cliente.email || '',
        direccion: user.cliente.direccion || '',
        ruc_cedula: user.cliente.ruc_cedula || '',
        id_ciudad: user.cliente.id_ciudad || '',
      });
    }
  }, [user]);

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/mi-cuenta' } });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validaciones
    if (!passwordData.passwordActual || !passwordData.passwordNueva || !passwordData.passwordConfirm) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    if (passwordData.passwordNueva.length < 6) {
      setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.passwordNueva !== passwordData.passwordConfirm) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      setSavingPassword(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1'}/auth/cambiar-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('barbox_token')}`
        },
        body: JSON.stringify({
          passwordActual: passwordData.passwordActual,
          passwordNueva: passwordData.passwordNueva
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Contraseña actualizada correctamente');
        setPasswordData({
          passwordActual: '',
          passwordNueva: '',
          passwordConfirm: '',
        });
      } else {
        setErrorMessage(data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.cliente?.id_cliente) return;

    try {
      setSavingProfile(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Llamar al endpoint de actualización de cliente
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1'}/clientes/${user.cliente.id_cliente}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('barbox_token')}`
        },
        body: JSON.stringify({
          nombre1: formData.nombre1,
          nombre2: formData.nombre2 || null,
          apellido1: formData.apellido1,
          apellido2: formData.apellido2 || null,
          telefono: formData.telefono || null,
          celular: formData.celular || null,
          email: formData.email || null,
          direccion: formData.direccion || null,
          id_ciudad: formData.id_ciudad || null,
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Perfil actualizado correctamente');
        setEditMode(false);
        // Recargar datos del usuario
        window.location.reload();
      } else {
        setErrorMessage(data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="mi-cuenta-page">
        {/* Hero Section */}
        <section className="cuenta-hero">
          <div className="container">
            <div className="cuenta-hero__content">
              <div className="cuenta-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="cuenta-hero__info">
                <h1>¡Hola, {user.usuario || 'Usuario'}!</h1>
                <p>Gestiona tu cuenta y preferencias</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="cuenta-content">
          <div className="container">
            <div className="cuenta-layout">
              
              {/* Sidebar */}
              <aside className="cuenta-sidebar">
                <nav className="cuenta-nav">
                  <button 
                    className={`cuenta-nav__item ${activeTab === 'perfil' ? 'active' : ''}`}
                    onClick={() => setActiveTab('perfil')}
                   
                    aria-current={activeTab === 'perfil' ? 'page' : undefined}
                  >
                    <i className="fas fa-user-circle"></i>
                    <span>Mi Perfil</span>
                  </button>
                  <button 
                    className={`cuenta-nav__item ${activeTab === 'seguridad' ? 'active' : ''}`}
                    onClick={() => setActiveTab('seguridad')}
                   
                    aria-current={activeTab === 'seguridad' ? 'page' : undefined}
                  >
                    <i className="fas fa-shield-alt"></i>
                    <span>Seguridad</span>
                  </button>
                  <button 
                    className="cuenta-nav__item"
                    onClick={() => navigate('/mis-pedidos')}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span>Mis Compras</span>
                  </button>
                  <button 
                    className="cuenta-nav__item"
                    onClick={() => navigate('/favoritos')}
                  >
                    <i className="fas fa-heart"></i>
                    <span>Favoritos</span>
                  </button>
                  <button 
                    className="cuenta-nav__item cuenta-nav__item--danger"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </nav>
              </aside>

              {/* Main Panel */}
              <div className="cuenta-panel">
                
                {/* Tab: Perfil */}
                {activeTab === 'perfil' && (
                  <div className="cuenta-section">
                    <div className="cuenta-section__header">
                      <h2>
                        <i className="fas fa-user-circle"></i>
                        Información Personal
                      </h2>
                      {!editMode && (
                        <button 
                          className="btn-edit"
                          onClick={() => setEditMode(true)}
                        >
                          <i className="fas fa-edit"></i>
                          Editar
                        </button>
                      )}
                    </div>

                    {successMessage && (
                      <div className="alert alert-success" style={{ marginBottom: '20px', padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px' }}>
                        <i className="fas fa-check-circle"></i> {successMessage}
                      </div>
                    )}
                    
                    {errorMessage && (
                      <div className="alert alert-error" style={{ marginBottom: '20px', padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
                        <i className="fas fa-exclamation-circle"></i> {errorMessage}
                      </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="cuenta-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="nombre1">Primer Nombre *</label>
                          <input
                            type="text"
                            id="nombre1"
                            name="nombre1"
                            value={formData.nombre1}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Primer nombre"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="nombre2">Segundo Nombre</label>
                          <input
                            type="text"
                            id="nombre2"
                            name="nombre2"
                            value={formData.nombre2}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Segundo nombre"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="apellido1">Primer Apellido *</label>
                          <input
                            type="text"
                            id="apellido1"
                            name="apellido1"
                            value={formData.apellido1}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Primer apellido"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="apellido2">Segundo Apellido</label>
                          <input
                            type="text"
                            id="apellido2"
                            name="apellido2"
                            value={formData.apellido2}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="Segundo apellido"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="telefono">Teléfono</label>
                          <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="022 123 4567"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="celular">Celular</label>
                          <input
                            type="tel"
                            id="celular"
                            name="celular"
                            value={formData.celular}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            placeholder="099 123 4567"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="ruc_cedula">Cédula / RUC</label>
                        <input
                          type="text"
                          id="ruc_cedula"
                          name="ruc_cedula"
                          value={formData.ruc_cedula}
                          onChange={handleInputChange}
                          disabled={true}
                          placeholder="1234567890"
                        />
                        <small className="field-hint">Este campo no se puede modificar</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="direccion">Dirección de Entrega</label>
                        <input
                          type="text"
                          id="direccion"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="Calle principal, número de casa, referencias"
                        />
                      </div>

                      {editMode && (
                        <div className="form-actions">
                          <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={() => {
                              setEditMode(false);
                              setErrorMessage('');
                              setSuccessMessage('');
                            }}
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={savingProfile}
                          >
                            {savingProfile ? (
                              <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Guardando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save"></i>
                                Guardar Cambios
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}

                {/* Tab: Seguridad */}
                {activeTab === 'seguridad' && (
                  <div className="cuenta-section">
                    <div className="cuenta-section__header">
                      <h2>
                        <i className="fas fa-shield-alt"></i>
                        Seguridad de la Cuenta
                      </h2>
                    </div>

                    {successMessage && (
                      <div className="alert alert-success" style={{ marginBottom: '20px', padding: '15px', background: '#d4edda', color: '#155724', borderRadius: '8px' }}>
                        <i className="fas fa-check-circle"></i> {successMessage}
                      </div>
                    )}
                    
                    {errorMessage && (
                      <div className="alert alert-error" style={{ marginBottom: '20px', padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
                        <i className="fas fa-exclamation-circle"></i> {errorMessage}
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="cuenta-form">
                      <div className="security-info" style={{ padding: '15px', background: '#e7f3ff', borderRadius: '8px', marginBottom: '25px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                          <i className="fas fa-info-circle"></i> Cambiar Contraseña
                        </h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                          Actualiza tu contraseña periódicamente para mantener tu cuenta segura
                        </p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="passwordActual">Contraseña Actual *</label>
                        <input
                          type="password"
                          id="passwordActual"
                          name="passwordActual"
                          value={passwordData.passwordActual}
                          onChange={handlePasswordChange}
                          placeholder="Ingresa tu contraseña actual"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="passwordNueva">Nueva Contraseña *</label>
                        <input
                          type="password"
                          id="passwordNueva"
                          name="passwordNueva"
                          value={passwordData.passwordNueva}
                          onChange={handlePasswordChange}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                        <small className="field-hint">La contraseña debe tener al menos 6 caracteres</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="passwordConfirm">Confirmar Nueva Contraseña *</label>
                        <input
                          type="password"
                          id="passwordConfirm"
                          name="passwordConfirm"
                          value={passwordData.passwordConfirm}
                          onChange={handlePasswordChange}
                          placeholder="Repite la nueva contraseña"
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="btn-primary"
                          disabled={savingPassword}
                        >
                          {savingPassword ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i>
                              Actualizando...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-key"></i>
                              Actualizar Contraseña
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MiCuentaPage;

