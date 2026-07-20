import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/api';

const inputStyle = {
  color: '#2d3b48',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(221, 221, 221, 0.5)',
  borderRadius: '8px',
  padding: '12px',
  backdropFilter: 'blur(4px)',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    document.body.classList.remove('fixed-left');
    if (window.$) {
      window.$('#status').fadeOut();
      window.$('#preloader').delay(350).fadeOut('slow');
      window.$('body').delay(350).css({ overflow: 'visible' });
    }
    return () => document.body.classList.add('fixed-left');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      // Backend returns { token, user } or { accessToken, user }
      const token = data.token || data.accessToken;
      const user  = data.user || data.data;
      if (!token) throw new Error('No token received. Please try again.');
      localStorage.setItem('vigil_token', token);
      localStorage.setItem('vigil_user',  JSON.stringify(user || {}));
      if (data.refreshToken) localStorage.setItem('vigil_refresh_token', data.refreshToken);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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

      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        style={{ position: 'fixed', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1 }}
      />

      <div className="wrapper-page">
        <div className="display-table">
          <div className="display-table-cell">
            <div className="container">
              <div className="row align-items-center">

                <div className="col-md-6 d-none d-md-block">
                  <motion.img
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src="/assets/images/extra.png"
                    alt="Illustration"
                    className="img-fluid"
                  />
                </div>

                <div className="col-md-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
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
                        <h5 className="mt-3 text-muted font-weight-normal">Sign in to continue</h5>
                      </div>

                      <div className="px-3 pb-3">
                        {error && (
                          <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: '8px', fontSize: '13px' }}>
                            {error}
                          </div>
                        )}

                        <form className="form-horizontal mb-0" onSubmit={handleLogin}>
                          <div className="form-group row">
                            <div className="col-12">
                              <input
                                className="form-control"
                                style={inputStyle}
                                type="email"
                                required
                                placeholder="Email or Mobile Number"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-12">
                              <input
                                className="form-control"
                                style={inputStyle}
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-group row mt-4">
                            <div className="col-12">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-primary btn-block waves-effect waves-light"
                                type="submit"
                                disabled={loading}
                                style={{ borderRadius: '8px', padding: '10px' }}
                              >
                                {loading ? 'Signing in...' : 'Log In'}
                              </motion.button>
                            </div>
                          </div>

                          <div className="form-group m-t-30 mb-0 row text-center mt-4">
                            <div className="col-12">
                              <Link to="/register" className="text-muted">
                                Don't have an account? <span className="text-primary font-weight-bold">Sign Up</span>
                              </Link>
                            </div>
                          </div>
                        </form>
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
