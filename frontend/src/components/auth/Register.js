import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        '/api/users/register', // <-- USE RELATIVE PATH
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard'; // Redirect to dashboard

    } catch (err) {
      // --- ROBUST CATCH BLOCK ---
      console.error("Registration failed:", err); 
      
      if (err.response) {
        // Server responded with an error (e.g., 400 "User already exists")
        setError(err.response.data?.msg || 'Registration failed. Please check your email.');
      } else if (err.request) {
        // Request was made, but no response was received (SERVER OFFLINE)
        setError('Cannot connect to the server. Is your backend running?');
      } else {
        // Something else happened (e.g., JS error)
        setError('An unexpected error occurred.');
      }
      // --- END ROBUST CATCH BLOCK ---
    }
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