import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register } from '../services/api';

const inputStyle = {
  color: '#2d3b48',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(221, 221, 221, 0.5)',
  borderRadius: '8px',
  padding: '12px',
  backdropFilter: 'blur(4px)',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password });
      if (data.token) {
        localStorage.setItem('vigil_token', data.token);
        localStorage.setItem('vigil_user', JSON.stringify({
          _id:   data.userId,
          id:    data.userId,
          name:  data.userName,
          email: data.userEmail,
        }));
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      
      {/* Animated background elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ position: 'fixed', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1 }}
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        style={{ position: 'fixed', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,150,136,0.2) 0%, transparent 70%)', borderRadius: '50%', zIndex: -1 }}
      />

      <div className="wrapper-page">
        <div className="display-table">
          <div className="display-table-cell">
            <div className="container">
              <div className="row align-items-center">
                
                {/* Left side illustration */}
                <div className="col-md-6 d-none d-md-block">
                  <motion.img 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    src="assets/images/extra.png" 
                    alt="Illustration" 
                    className="img-fluid drop-shadow-2xl" 
                  />
                </div>
                
                {/* Right side register card */}
                <div className="col-md-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="card"
                    style={{
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      borderRadius: '16px'
                    }}
                  >
                    <div className="card-body">

                      <div className="text-center pt-3 pb-4">
                        <Link to="/login">
                          <img src="image.png" alt="logo" height="60" style={{ maxWidth: '200px', objectFit: 'contain' }} />
                        </Link>
                        <h5 className="mt-3 text-muted font-weight-normal">Create an account</h5>
                      </div>

                      <div className="px-3 pb-3">
                        {error && (
                          <div className="alert alert-danger py-2 mb-3" style={{ borderRadius: '8px', fontSize: '13px' }}>{error}</div>
                        )}
                        <form className="form-horizontal mb-0" onSubmit={handleRegister}>

                          <div className="form-group row">
                            <div className="col-12">
                              <input className="form-control" style={inputStyle} type="text" required
                                placeholder="Full Name" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-12">
                              <input className="form-control" style={inputStyle} type="email" required
                                placeholder="Email Address" value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-12">
                              <input className="form-control" style={inputStyle} type="password" required
                                placeholder="Password" value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                            </div>
                          </div>

                          <div className="form-group row">
                            <div className="col-12">
                              <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id="customCheck1" required />
                                <label className="custom-control-label font-weight-normal" htmlFor="customCheck1">
                                  I accept <a href="https://vigil-1.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary font-weight-bold">Terms and Conditions</a>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group text-center row mt-4">
                            <div className="col-12">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn btn-primary btn-block waves-effect waves-light"
                                type="submit"
                                disabled={loading}
                                style={{ borderRadius: '8px', padding: '10px' }}
                              >
                                {loading ? 'Creating account...' : 'Register'}
                              </motion.button>
                            </div>
                          </div>

                          <div className="mt-4 text-center">
                            <p className="text-muted mb-3"><small>Or sign up with</small></p>
                            <div className="d-flex justify-content-center gap-3">
                              <motion.button 
                                whileHover={{ y: -2 }}
                                type="button" 
                                className="btn btn-light mx-1" 
                                style={{ borderRadius: '8px', border: '1px solid #ddd', padding: '8px 16px', background: 'white' }}
                              >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" height="18" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ y: -2 }}
                                type="button" 
                                className="btn btn-dark mx-1" 
                                style={{ borderRadius: '8px', padding: '8px 16px' }}
                              >
                                <i className="mdi mdi-apple" style={{ fontSize: '18px' }}></i>
                              </motion.button>
                            </div>
                          </div>

                          <div className="form-group m-t-10 mb-0 row text-center mt-4">
                            <div className="col-12">
                              <Link to="/login" className="text-muted">
                                Already have an account? <span className="text-primary font-weight-bold">Log in</span>
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
