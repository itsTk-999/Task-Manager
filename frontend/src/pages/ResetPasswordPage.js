import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      // Use relative path
      await axios.post('/api/users/reset-password',
        { token, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setMessage('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. The link may be invalid or expired.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form glass-panel">
        <h2>Set New Password</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password" className="form-label">
              <FaLock /> New Password
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

          <div className="form-group">
            <input
              type={showConfirm ? 'text' : 'password'}
              id="confirmPassword"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock /> Confirm New Password
            </label>
            {showConfirm ? (
              <FaEyeSlash
                className="password-icon"
                onClick={() => setShowConfirm(false)}
              />
            ) : (
              <FaEye
                className="password-icon"
                onClick={() => setShowConfirm(true)}
              />
            )}
          </div>

          {message && <p style={{ color: 'var(--green)', textAlign: 'center' }}>{message}</p>}
          {error && <p style={{ color: 'var(--orange)', textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;