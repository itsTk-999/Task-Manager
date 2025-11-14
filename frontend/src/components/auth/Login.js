import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard'; // Redirect to dashboard

    } catch (err) {
      // --- THIS IS THE ROBUST FIX ---
      console.error("Login failed:", err); // Log the full error to the console
      
      if (err.response) {
        // The server responded with an error (e.g., 400 "Invalid Credentials")
        setError(err.response.data?.msg || 'Invalid credentials or server error.');
      } else if (err.request) {
        // The request was made, but no response was received
        // This means the backend server is likely OFFLINE.
        setError('Cannot connect to the server. Is your backend running?');
      } else {
        // Something else happened setting up the request
        setError('An unexpected error occurred.');
      }
      // --- END FIX ---
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Welcome Back</h2>
      {error && (
        <p style={{ color: 'var(--orange)', textAlign: 'center', marginBottom: '1rem' }} >
          {error}
        </p>
      )}
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
        Login
      </button>

      <div className="auth-links">
        <p className="auth-toggle">
          Don't have an account? <span onClick={onToggleMode}>Sign Up</span>
        </p>
        <Link to="/forgot-password" className="auth-forgot-link">
          Forgot Password?
        </Link>
      </div>
    </form>
  );
};

export default Login;