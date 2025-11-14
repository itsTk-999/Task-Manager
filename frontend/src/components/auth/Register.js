import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- 1. Import icons

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- 2. Add state

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // ... (register logic)
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Create Account</h2>
      {error && (
        <p style={{ color: 'var(--orange)', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </p>
      )}
      <div className="form-group">
        <input
          type="text"
          id="name"
          className="form-input"
          value={name}
          onChange={onChange}
          required
        />
        <label htmlFor="name" className="form-label">
          <FaUser /> Name
        </label>
      </div>
      <div className="form-group">
        <input
          type="email"
          id="email"
          className="form-input"
          value={email}
          onChange={onChange}
          required
        />
        <label htmlFor="email" className="form-label">
          <FaUser /> Email
        </label>
      </div>

      {/* --- 3. UPDATE PASSWORD BLOCK --- */}
      <div className="form-group">
        <input
          type={showPassword ? 'text' : 'password'} 
          id="password"
          className="form-input"
          value={password}
          onChange={onChange}
          required
          minLength="6"
        />
        <label htmlFor="password" className="form-label">
          <FaLock /> Password
        </label>
        {/* The icon */}
        {showPassword ? (
          <FaEyeSlash
            className="password-icon"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <FaEye
            className="password-icon"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
      {/* --- END UPDATE --- */}

      <button type="submit" className="btn btn-primary">
        Register
      </button>
      <p className="auth-toggle">
        Already have an account? <span onClick={onToggleMode}>Sign In</span>
      </p>
    </form>
  );
};

export default Register;