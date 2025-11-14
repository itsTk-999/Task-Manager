import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="auth-container">
      <div className="auth-form glass-panel">
        {isLogin ? (
          <Login onToggleMode={toggleAuthMode} />
        ) : (
          <Register onToggleMode={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;