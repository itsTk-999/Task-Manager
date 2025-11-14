import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post(
        '/api/users/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(res.data.msg);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form glass-panel">
        <h2>Reset Password</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email" className="form-label">
              <FaEnvelope /> Email
            </label>
          </div>

          {message && <p style={{ color: 'var(--green)', textAlign: 'center' }}>{message}</p>}
          {error && <p style={{ color: 'var(--orange)', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;