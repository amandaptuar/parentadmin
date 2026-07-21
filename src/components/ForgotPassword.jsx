import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { requestPasswordReset, verifyOtp, resetPassword } from '../services/api';

const inputStyle = {
  color: '#2d3b48',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(221, 221, 221, 0.5)',
  borderRadius: '8px',
  padding: '12px',
  backdropFilter: 'blur(4px)',
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email -> otp -> password -> done
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Could not send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep('password');
    } catch (err) {
      setError(err.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, otp, password);
      setStep('done');
    } catch (err) {
      setError(err.message || 'Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="accountbg" style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1
      }}></div>

      <div className="wrapper-page">
        <div className="display-table">
          <div className="display-table-cell">
            <div className="container">
              <div className="row align-items-center justify-content-center">
                <div className="col-md-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="card"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                    }}
                  >
                    <div className="card-body">
                      <div className="text-center pt-3 pb-4">
                        <Link to="/login">
                          <img src="/image.png" alt="logo" height="60" style={{ maxWidth: '200px', objectFit: 'contain' }} />
                        </Link>
                        <h5 className="mt-3 text-muted font-weight-normal">Reset your password</h5>
                      </div>

                      <div className="px-3 pb-3">
                        {error && (
                          <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: '8px', fontSize: '13px' }}>{error}</div>
                        )}

                        {step === 'email' && (
                          <form onSubmit={handleRequestOtp}>
                            <p className="text-muted mb-3" style={{ fontSize: 14 }}>
                              Enter your account email — we'll send you a verification code.
                            </p>
                            <div className="form-group row">
                              <div className="col-12">
                                <input className="form-control" style={inputStyle} type="email" required
                                  placeholder="Email Address" value={email}
                                  onChange={e => setEmail(e.target.value)} />
                              </div>
                            </div>
                            <div className="form-group row mt-4">
                              <div className="col-12">
                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={loading}
                                  style={{ borderRadius: '8px', padding: '10px' }}>
                                  {loading ? 'Sending code...' : 'Send Reset Code'}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}

                        {step === 'otp' && (
                          <form onSubmit={handleVerifyOtp}>
                            <p className="text-muted mb-3" style={{ fontSize: 14 }}>
                              Enter the 6-digit code sent to <strong>{email}</strong>.
                            </p>
                            <div className="form-group row">
                              <div className="col-12">
                                <input className="form-control" style={inputStyle} type="text" required
                                  placeholder="Verification Code" value={otp}
                                  onChange={e => setOtp(e.target.value)} />
                              </div>
                            </div>
                            <div className="form-group row mt-4">
                              <div className="col-12">
                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={loading}
                                  style={{ borderRadius: '8px', padding: '10px' }}>
                                  {loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}

                        {step === 'password' && (
                          <form onSubmit={handleResetPassword}>
                            <div className="form-group row">
                              <div className="col-12">
                                <input className="form-control" style={inputStyle} type="password" required
                                  placeholder="New Password" value={password}
                                  onChange={e => setPassword(e.target.value)} />
                              </div>
                            </div>
                            <div className="form-group row mt-3">
                              <div className="col-12">
                                <input className="form-control" style={inputStyle} type="password" required
                                  placeholder="Confirm New Password" value={confirmPassword}
                                  onChange={e => setConfirmPassword(e.target.value)} />
                              </div>
                            </div>
                            <div className="form-group row mt-4">
                              <div className="col-12">
                                <button className="btn btn-primary btn-block waves-effect waves-light" type="submit" disabled={loading}
                                  style={{ borderRadius: '8px', padding: '10px' }}>
                                  {loading ? 'Saving...' : 'Reset Password'}
                                </button>
                              </div>
                            </div>
                          </form>
                        )}

                        {step === 'done' && (
                          <div className="text-center py-3">
                            <p className="text-success font-weight-bold">Your password has been reset successfully.</p>
                            <button className="btn btn-primary rounded-pill px-4 mt-2" onClick={() => navigate('/login')}>
                              Go to Login
                            </button>
                          </div>
                        )}

                        {step !== 'done' && (
                          <div className="mt-4 text-center">
                            <Link to="/login" className="text-muted">
                              Back to <span className="text-primary font-weight-bold">Login</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
