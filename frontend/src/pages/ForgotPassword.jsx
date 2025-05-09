import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css'; // Make sure this file exists or comment this out

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaString = '';
    for (let i = 0; i < 6; i++) {
      captchaString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captchaString;
  };

  // Set CAPTCHA when component mounts
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // Handle CAPTCHA input change
  const handleCaptchaChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (userInput !== captcha) {
      setError('Captcha does not match. Please try again.');
      setCaptcha(generateCaptcha()); // Refresh captcha
      setUserInput(''); // Clear user input
      return;
    }

    // Clear previous error and set loading state
    setError('');
    setMessage('Processing...');

    try {
      // API call to reset password
      const data = { email, newPassword };
      const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 200) {
        setMessage('Password reset successfully!');
        setError('');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after a brief delay
        }, 1500);
      } else {
        setError(result.message || 'Failed to reset the password.');
        setMessage('');
      }
    } catch (err) {
      setError('An error occurred while resetting the password.');
      setMessage('');
    }
  };

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setUserInput('');
    setError('');
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="card p-4 shadow rounded">
        <h2 className="mb-3 text-center">Forgot Password</h2>

        {message && <p className="text-success text-center">{message}</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* CAPTCHA */}
        <div className="mb-3 d-flex align-items-center">
          <div
            className="captcha-display p-3 me-2 rounded border d-flex align-items-center justify-content-center"
            style={{
              minWidth: '150px',
              height: '50px',
              backgroundColor: '#f0f0f0',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: '3px',
              userSelect: 'none',
            }}
          >
            {captcha}
          </div>
          <div
            className="refresh-icon"
            onClick={refreshCaptcha}
            style={{ cursor: 'pointer' }}
            title="Refresh CAPTCHA"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#555" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V7c3.31 0 6 2.69 6 6 0 1.61-.63 3.07-1.76 4.12l2.88 2.88C20.91 17.17 22 14.73 22 12c0-5.52-4.48-10-10-10zm-1.41 4.83l-2.12 2.12C9.73 9.92 9.9 9 10.41 9H12v2.83zM12 6c-4.41 0-8 3.59-8 8 0 2.76 1.46 5.17 3.59 6.5L2.12 19.88C1.14 18.39 1 16.29 1 14c0-5.52 4.48-10 10-10v2z" />
            </svg>
          </div>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter CAPTCHA"
            value={userInput}
            onChange={handleCaptchaChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Reset Password
        </button>

        <div className="mt-3 text-center">
          <Link to="/login" className="text-decoration-none">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
