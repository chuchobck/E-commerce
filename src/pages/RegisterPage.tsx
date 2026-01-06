import React from 'react';
import Register from '../components/Auth/Register';

const RegisterPage: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🍷</div>
          <h1>BARBOX</h1>
          <p>Únete a nuestra comunidad</p>
        </div>
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
