import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Battery, Wifi, WifiOff, Plus, RefreshCw, Smartphone, X, AlertTriangle } from 'lucide-react';
import { getChildren, getUser, getMySubscription, getDashboardSummary } from '../services/api';
import { useChild } from '../context/ChildContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectChild } = useChild();
  const user = getUser();

  const [children, setChildren]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [summary, setSummary]           = useState({ deviceCount: 0, onlineCount: 0, alertsToday: 0 });
  const [showAddDevice, setShowAddDevice] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [childData, subData, summaryData] = await Promise.allSettled([
        getChildren(),
        getMySubscription(),
        getDashboardSummary(),
      ]);
      if (childData.status === 'fulfilled') {
        const list = childData.value?.children || childData.value?.data || childData.value || [];
        setChildren(Array.isArray(list) ? list : []);
      }
      if (subData.status === 'fulfilled') setSubscription(subData.value);
      if (summaryData.status === 'fulfilled') setSummary(summaryData.value);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewActivity = (child) => {
    selectChild(child);
    navigate('/dashboard/live-activity');
  };

  const getPlanLabel = () => {
    if (!subscription) return 'Free Trial';
    return subscription.plan_name || 'Active Plan';
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        {/* Header */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 60, height: 60, fontSize: 22, flexShrink: 0 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div>
                <h4 className="page-title m-0">Welcome back, {user?.name || 'Parent'}</h4>
                <p className="text-muted m-0">
                  {loading ? 'Loading...' : `You're monitoring ${children.length} device${children.length !== 1 ? 's' : ''} today.`}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0 gap-3 align-items-center">
            <div className="d-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm border border-success">
              <ShieldCheck className="text-success mr-2" size={18} />
              <span className="font-weight-bold text-success" style={{ fontSize: '13px' }}>{getPlanLabel()}</span>
            </div>
            <button className="btn btn-light rounded-circle shadow-sm p-2" onClick={fetchData} title="Refresh">
              <RefreshCw size={18} className="text-dark" />
            </button>
            <Link to="/dashboard/notifications">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <Bell size={20} className="text-dark" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Smartphone size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-muted small m-0">Devices</p>
                  <h5 className="font-weight-bold m-0">{loading ? '—' : summary.deviceCount}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <Wifi size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-muted small m-0">Online Now</p>
                  <h5 className="font-weight-bold m-0">{loading ? '—' : `${summary.onlineCount}/${summary.deviceCount}`}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-lg h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                  <AlertTriangle size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-muted small m-0">Alerts Today</p>
                  <h5 className="font-weight-bold m-0">{loading ? '—' : summary.alertsToday}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Children Cards */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="header-title mb-4">Monitored Devices</h5>

            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                Loading devices...
              </div>
            ) : (
              <div className="d-flex gap-4 overflow-auto pb-4" style={{ scrollbarWidth: 'none' }}>

                {children.map((child, index) => {
                  const isOnline  = child.isOnline || child.liveStatus?.isOnline || false;
                  const battery   = child.batteryLevel ?? child.batteryInfo?.level ?? child.liveStatus?.batteryInfo?.level ?? null;
                  const deviceName = child.deviceName || child.deviceInfo?.model || 'Device';

                  return (
                    <motion.div
                      key={child._id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                      className="card border-0 flex-shrink-0"
                      style={{ width: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                    >
                      <div className="card-body text-center position-relative">

                        <div className="position-absolute d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                          style={{ top: '15px', right: '15px', background: isOnline ? 'rgba(0,150,136,0.1)' : 'rgba(153,153,153,0.1)' }}>
                          {isOnline ? (
                            <><Wifi size={12} className="text-success" /><small className="text-success font-weight-bold">Online</small></>
                          ) : (
                            <><WifiOff size={12} className="text-muted" /><small className="text-muted font-weight-bold">Offline</small></>
                          )}
                        </div>

                        <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center fw-bold mx-auto mt-3 mb-3"
                          style={{ width: 80, height: 80, fontSize: 28, border: '3px solid white' }}>
                          {child.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <h5 className="m-0 font-weight-bold">{child.name}</h5>
                        <p className="text-muted mb-3"><small>{deviceName}</small></p>

                        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                          <div className="d-flex align-items-center gap-2">
                            {battery !== null ? (
                              <>
                                <Battery size={16} className={battery > 20 ? 'text-success' : 'text-danger'} />
                                <span className="font-weight-bold">{battery}%</span>
                              </>
                            ) : (
                              <span className="text-muted" style={{ fontSize: 12 }}>—</span>
                            )}
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            onClick={() => handleViewActivity(child)}
                          >
                            View Activity
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}

                {children.length === 0 && (
                  <div className="text-muted py-4">
                    <p>No devices found. Link a child device through the Vigil app.</p>
                  </div>
                )}

                {/* Add Device card */}
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                  onClick={() => setShowAddDevice(true)}
                  className="card border-0 flex-shrink-0 d-flex justify-content-center align-items-center"
                  style={{ width: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', border: '2px dashed #d0d7de' }}
                >
                  <div className="text-center text-muted p-4">
                    <div className="rounded-circle bg-white shadow-sm d-flex justify-content-center align-items-center mx-auto mb-2"
                      style={{ width: '50px', height: '50px' }}>
                      <Plus size={24} className="text-primary" />
                    </div>
                    <h6 className="font-weight-bold mt-3 text-primary">+ Add Device</h6>
                    <small>Pair via the Vigil child app</small>
                  </div>
                </motion.div>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Device Modal */}
      {showAddDevice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setShowAddDevice(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #3f51b5, #009688)', padding: '24px 24px 20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="d-flex align-items-center gap-3">
                <Smartphone size={28} />
                <div>
                  <h5 className="m-0 font-weight-bold">Pair a Child Device</h5>
                  <small className="opacity-75">Follow the steps below</small>
                </div>
              </div>
              <button onClick={() => setShowAddDevice(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              {[
                { step: 1, title: 'Download Vigil Child App',   desc: 'Install the Vigil Child app on the device you want to monitor (available on Android).' },
                { step: 2, title: 'Open the App & Enter Email', desc: `On the child device, open the app and enter your parent email: ${user?.email || 'your registered email'}.` },
                { step: 3, title: 'Approve via OTP',            desc: 'You will receive an OTP on your email. Enter it in the child app to complete pairing.' },
                { step: 4, title: 'Done!',                      desc: 'The device will appear on your dashboard automatically once pairing is confirmed.' },
              ].map(s => (
                <div key={s.step} className="d-flex gap-3 mb-4">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3f51b5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: 14 }}>
                    {s.step}
                  </div>
                  <div>
                    <h6 className="m-0 font-weight-bold">{s.title}</h6>
                    <p className="m-0 text-muted" style={{ fontSize: 13 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => { setShowAddDevice(false); fetchData(); }}
                className="btn btn-primary btn-block rounded-pill font-weight-bold py-2">
                Done — Refresh Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
