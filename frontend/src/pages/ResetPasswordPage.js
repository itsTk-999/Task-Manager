import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // <-- 1. Import icons

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- 2. ADD TWO STATES ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // --- END ADD ---

  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    // ... (submit logic)
  };

  return (
    <div className="auth-container">
      <div className="auth-form glass-panel">
        <h2>Set New Password</h2>
        <form onSubmit={onSubmit}>
          {/* --- 3. UPDATE FIRST PASSWORD BLOCK --- */}
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
          {/* --- END UPDATE --- */}

          {/* --- 4. UPDATE SECOND PASSWORD BLOCK --- */}
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
          {/* --- END UPDATE --- */}

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