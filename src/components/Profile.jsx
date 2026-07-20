import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit, Settings, Activity, ShieldCheck, CheckCircle } from 'lucide-react';
import { getProfile, updateProfile, getChildren, getUser } from '../services/api';
import { useChild } from '../context/ChildContext';

export default function Profile() {
  const { selectChild } = useChild();
  const [activeTab, setActiveTab] = useState('about');
  const [profile, setProfile]     = useState(getUser() || {});
  const [children, setChildren]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState('');

  const [form, setForm] = useState({
    name:        '',
    mobile:      '',
    address:     '',
    city:        '',
    country:     '',
    postal_code: '',
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [prof, kids] = await Promise.allSettled([
          getProfile(),
          getChildren(),
        ]);
        if (prof.status === 'fulfilled') {
          const u = prof.value?.user || prof.value;
          setProfile(u);
          setForm({
            name:        u.name        || '',
            mobile:      u.mobile      || '',
            address:     u.address     || '',
            city:        u.city        || '',
            country:     u.country     || '',
            postal_code: u.postal_code || '',
          });
        }
        if (kids.status === 'fulfilled') {
          const list = kids.value?.children || kids.value?.data || kids.value || [];
          setChildren(Array.isArray(list) ? list : []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      setProfile(prev => ({ ...prev, ...form }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'about',    label: 'Personal Info',     icon: User     },
    { id: 'children', label: 'Monitored Devices', icon: Activity },
    { id: 'settings', label: 'Edit Profile',      icon: Settings },
  ];

  const loadSubscription = () => {
    setSubLoading(true);
    getMySubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setSubLoading(false));
  };

  useEffect(() => {
    loadSubscription();

    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setPaymentBanner({ type: 'success', text: 'Payment successful! Your subscription is now active.' });
      loadSubscription();
      setSearchParams({}, { replace: true });
    } else if (paymentStatus === 'cancel') {
      setPaymentBanner({ type: 'cancel', text: 'Checkout was canceled — no charge was made.' });
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPlansModal = () => {
    setShowPlansModal(true);
    if (plans.length === 0) {
      setPlansLoading(true);
      getPlans()
        .then((res) => setPlans(res.plans || []))
        .catch(() => setPlans([]))
        .finally(() => setPlansLoading(false));
    }
  };

  const startCheckout = async (plan) => {
    setCheckoutPlanId(plan._id);
    try {
      let user = {};
      try { user = JSON.parse(localStorage.getItem('vigil_parent_user') || '{}'); } catch { /* ignore */ }
      const email = user.userEmail || user.email;
      const name = user.userName || user.name;

      const res = await createCheckoutSession({
        planId: plan._id,
        email,
        name,
        success_url: `${window.location.origin}/profile?payment=success`,
        cancel_url: `${window.location.origin}/profile?payment=cancel`,
      });

      if (res.url) {
        window.location.href = res.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setPaymentBanner({ type: 'cancel', text: err.message || 'Could not start checkout. Please try again.' });
      setCheckoutPlanId(null);
    }
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
              <div style={{ height: 160, background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)' }} />
              <div className="card-body px-4 px-md-5 pb-4 position-relative">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4" style={{ marginTop: -65 }}>
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow"
                    style={{ width: 120, height: 120, fontSize: 42, border: '4px solid white', flexShrink: 0 }}>
                    {(profile.name || profile.email || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1 text-center text-md-left pt-2 pb-3 pb-md-0">
                    <h3 className="font-weight-bold m-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      {loading ? '...' : (profile.name || 'Parent')}
                      <ShieldCheck className="text-success" size={22} />
                    </h3>
                    <p className="text-muted m-0 mt-1">{profile.email || '—'}</p>
                  </div>
                  <div>
                    <button onClick={() => setActiveTab('settings')}
                      className="btn btn-primary rounded-pill px-4 shadow-sm font-weight-bold d-flex align-items-center gap-2">
                      <Edit size={15} /> Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="row">

          {/* Left contact card */}
          <div className="col-lg-4 mb-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="card shadow-sm border-0 rounded-lg mb-4">
              <div className="card-body p-4">
                <h5 className="font-weight-bold mb-4">Contact Information</h5>
                <ul className="list-unstyled m-0">
                  <li className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom text-muted">
                    <Mail className="text-primary" size={18} />
                    <span>{profile.email || '—'}</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom text-muted">
                    <Phone className="text-primary" size={18} />
                    <span>{profile.mobile || 'Not set'}</span>
                  </li>
                  {(profile.city || profile.country) && (
                    <li className="d-flex align-items-center gap-3 text-muted">
                      <User className="text-primary" size={18} />
                      <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="card shadow-sm border-0 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', color: 'white' }}>
              <div className="card-body p-4 text-center">
                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 56, height: 56 }}>
                  <ShieldCheck size={28} className="text-success" />
                </div>
                <h5 className="font-weight-bold text-white mb-1">Vigil Guardian</h5>
                <p className="text-white-50 mb-3">Monitoring {children.length} device{children.length !== 1 ? 's' : ''}</p>
              </div>
            </motion.div>
          </div>

          {/* Right tabs */}
          <div className="col-lg-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="card shadow-sm border-0 rounded-lg">

              <div className="card-header bg-white border-bottom p-0">
                <div className="d-flex overflow-auto" style={{ scrollbarWidth: 'none' }}>
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className="btn rounded-0 px-4 py-3 d-flex align-items-center gap-2 border-0 bg-transparent text-dark position-relative"
                        style={{ fontWeight: isActive ? 700 : 400, flexShrink: 0 }}>
                        <Icon size={16} className={isActive ? 'text-primary' : 'text-muted'} />
                        <span className={isActive ? '' : 'text-muted'} style={{ fontSize: 14 }}>{tab.label}</span>
                        {isActive && (
                          <motion.div layoutId="profileTabBar"
                            className="position-absolute bg-primary" style={{ height: 3, bottom: 0, left: 0, right: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card-body p-4 p-md-5" style={{ minHeight: 400 }}>

                {activeTab === 'about' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">Account Information</h5>
                    <div className="row g-3">
                      {[
                        { label: 'Full Name',   value: profile.name         },
                        { label: 'Email',       value: profile.email        },
                        { label: 'Phone',       value: profile.mobile       },
                        { label: 'Address',     value: profile.address      },
                        { label: 'City',        value: profile.city         },
                        { label: 'Country',     value: profile.country      },
                        { label: 'Postal Code', value: profile.postal_code  },
                      ].map(f => (f.value ? (
                        <div key={f.label} className="col-md-6">
                          <p className="text-muted mb-0" style={{ fontSize: 12 }}>{f.label}</p>
                          <p className="font-weight-bold m-0">{f.value}</p>
                        </div>
                      ) : null))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'children' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">Monitored Devices</h5>
                    {loading ? (
                      <div className="text-muted py-3">
                        <div className="spinner-border spinner-border-sm me-2"></div> Loading...
                      </div>
                    ) : children.length === 0 ? (
                      <p className="text-muted">No devices linked yet.</p>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {children.map(child => (
                          <div key={child._id}
                            className="d-flex align-items-center gap-3 p-3 rounded-lg"
                            style={{ background: '#f8f9fa' }}>
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: 48, height: 48, fontSize: 18, flexShrink: 0 }}>
                              {child.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="m-0 font-weight-bold">{child.name}</h6>
                              <p className="m-0 text-muted small">{child.deviceName || child.deviceInfo?.model || 'Unknown device'}</p>
                            </div>
                            <Link to="/dashboard/live-activity"
                              onClick={() => selectChild(child)}
                              className="btn btn-sm btn-outline-primary rounded-pill">
                              View Activity
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">Edit Profile</h5>

                    {error && (
                      <div className="alert alert-danger rounded-lg py-2" style={{ fontSize: 14 }}>{error}</div>
                    )}
                    {saved && (
                      <div className="alert alert-success rounded-lg py-2 d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                        <CheckCircle size={16} /> Changes saved successfully.
                      </div>
                    )}

                    <form onSubmit={handleSave}>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label className="text-muted font-weight-bold small">Full Name</label>
                          <input type="text" className="form-control bg-light border-0"
                            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted font-weight-bold small">Phone Number</label>
                          <input type="tel" className="form-control bg-light border-0"
                            value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted font-weight-bold small">Email Address</label>
                        <input type="email" className="form-control bg-light border-0" value={profile.email || ''} disabled />
                      </div>
                      <div className="mb-3">
                        <label className="text-muted font-weight-bold small">Address</label>
                        <input type="text" className="form-control bg-light border-0"
                          value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                          <label className="text-muted font-weight-bold small">City</label>
                          <input type="text" className="form-control bg-light border-0"
                            value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                          <label className="text-muted font-weight-bold small">Country</label>
                          <input type="text" className="form-control bg-light border-0"
                            value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                        </div>
                        <div className="col-md-4">
                          <label className="text-muted font-weight-bold small">Postal Code</label>
                          <input type="text" className="form-control bg-light border-0"
                            value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))} />
                        </div>
                      </div>
                      <div className="text-end">
                        <button type="submit" disabled={saving}
                          className="btn btn-primary rounded-pill px-5 font-weight-bold shadow-sm">
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Plan Selection Modal */}
      <AnimatePresence>
        {showPlansModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="d-flex align-items-center justify-content-center"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
            onClick={() => setShowPlansModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="card border-0 rounded-lg shadow"
              style={{ width: '90%', maxWidth: '900px', maxHeight: '85vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h4 className="font-weight-bold m-0">Choose a Plan</h4>
                  <button className="btn btn-light rounded-circle p-2" onClick={() => setShowPlansModal(false)}>
                    <X size={18} />
                  </button>
                </div>

                {plansLoading ? (
                  <div className="text-center py-5 text-muted">Loading plans…</div>
                ) : plans.length === 0 ? (
                  <div className="text-center py-5 text-muted">No plans available right now.</div>
                ) : (
                  <div className="row">
                    {plans.map((plan) => {
                      const isCurrent = subscription && subscription.hasSubscription &&
                        subscription.subscription.plan_id === plan._id;
                      const isCheckingOut = checkoutPlanId === plan._id;
                      return (
                        <div key={plan._id} className="col-md-4 mb-4">
                          <div className="card h-100 border shadow-sm rounded-lg">
                            <div className="card-body d-flex flex-column p-4">
                              <h5 className="font-weight-bold mb-1">{plan.name}</h5>
                              <p className="text-muted small mb-3">{plan.description}</p>
                              <h3 className="font-weight-bold mb-1">
                                {plan.currency} {plan.price}
                                <span className="text-muted small font-weight-normal"> / {plan.duration_days}d</span>
                              </h3>
                              <p className="text-muted small mb-4">Up to {plan.max_children} device(s)</p>
                              <button
                                className="btn btn-primary rounded-pill mt-auto font-weight-bold"
                                disabled={isCurrent || isCheckingOut}
                                onClick={() => startCheckout(plan)}
                              >
                                {isCurrent ? (
                                  'Current Plan'
                                ) : isCheckingOut ? (
                                  <span className="d-flex align-items-center justify-content-center gap-2">
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Redirecting…
                                  </span>
                                ) : (
                                  'Subscribe'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
