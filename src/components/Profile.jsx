import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Globe, Edit,
  Settings, Activity, ShieldCheck, Camera, CheckCircle, X, Loader2
} from 'lucide-react';
import { getPlans, getMySubscription, createCheckoutSession } from '../services/api';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('about');
  const [searchParams, setSearchParams] = useSearchParams();

  const [subscription, setSubscription] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [checkoutPlanId, setCheckoutPlanId] = useState(null);
  const [paymentBanner, setPaymentBanner] = useState(null);

  const tabs = [
    { id: 'about', label: 'Personal Info', icon: User },
    { id: 'activity', label: 'Recent Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
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

        {paymentBanner && (
          <div
            className={`alert ${paymentBanner.type === 'success' ? 'alert-success' : 'alert-warning'} d-flex align-items-center justify-content-between`}
            role="alert"
          >
            <span>{paymentBanner.text}</span>
            <button type="button" className="btn btn-sm btn-link text-dark" onClick={() => setPaymentBanner(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row mb-4"
        >
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden bg-white">
              <div 
                style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)',
                  position: 'relative'
                }}
              >
                {/* Overlay pattern */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
              </div>
              
              <div className="card-body px-4 px-md-5 pb-5 position-relative">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4" style={{ marginTop: '-80px' }}>
                  
                  {/* Avatar */}
                  <div className="position-relative">
                    <img 
                      src="https://i.pravatar.cc/150?u=parent" 
                      alt="Profile" 
                      className="rounded-circle shadow" 
                      style={{ width: '150px', height: '150px', border: '5px solid white', objectFit: 'cover' }}
                    />
                    <button className="btn btn-primary rounded-circle position-absolute d-flex align-items-center justify-content-center shadow" style={{ width: '40px', height: '40px', bottom: '10px', right: '0' }}>
                      <Camera size={18} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-grow-1 text-center text-md-left mb-3 mb-md-0 pt-3 pt-md-0">
                    <h3 className="font-weight-bold m-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                      Sarah Carlile <ShieldCheck className="text-success" size={24} />
                    </h3>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: '16px' }}>Account Administrator & Parent</p>
                  </div>

                  {/* Action */}
                  <div>
                    <button onClick={() => setActiveTab('settings')} className="btn btn-primary rounded-pill px-4 shadow-sm font-weight-bold d-flex align-items-center gap-2">
                      <Edit size={16} /> Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="row">
          
          {/* Left Column */}
          <div className="col-lg-4 mb-4">
            
            {/* Contact Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card shadow-sm border-0 rounded-lg mb-4"
            >
              <div className="card-body p-4">
                <h5 className="font-weight-bold mb-4">Contact Information</h5>
                <ul className="list-unstyled m-0">
                  <li className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom text-muted">
                    <Mail className="text-primary" size={20} />
                    <span>sarah.carlile@example.com</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom text-muted">
                    <Phone className="text-primary" size={20} />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom text-muted">
                    <MapPin className="text-primary" size={20} />
                    <span>New York, USA</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 text-muted">
                    <Globe className="text-primary" size={20} />
                    <span>English (US)</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Plan Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card shadow-sm border-0 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', color: 'white' }}
            >
              <div className="card-body p-4 text-center">
                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}>
                  <ShieldCheck size={30} className="text-success" />
                </div>
                {subLoading ? (
                  <p className="text-white-50 mb-3">Loading plan…</p>
                ) : subscription && subscription.hasSubscription ? (
                  <>
                    <h5 className="font-weight-bold text-white mb-1">{subscription.subscription.plan_name}</h5>
                    <p className="text-white-50 mb-3">
                      {subscription.inTrial
                        ? `Trial — ${subscription.trialDaysRemaining} day(s) left`
                        : `${subscription.daysRemaining} day(s) remaining`}
                    </p>
                  </>
                ) : (
                  <>
                    <h5 className="font-weight-bold text-white mb-1">No Active Plan</h5>
                    <p className="text-white-50 mb-3">Choose a plan to get started</p>
                  </>
                )}
                <button onClick={openPlansModal} className="btn btn-light rounded-pill btn-sm px-4 font-weight-bold">
                  {subscription && subscription.hasSubscription ? 'Manage Plan' : 'Choose a Plan'}
                </button>
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="col-lg-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card shadow-sm border-0 rounded-lg"
            >
              
              {/* Custom Tabs */}
              <div className="card-header bg-white border-bottom p-0">
                <div className="d-flex overflow-auto" style={{ scrollbarWidth: 'none' }}>
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="btn rounded-0 px-4 py-3 d-flex align-items-center gap-2 border-0 bg-transparent text-dark position-relative"
                        style={{ fontSize: '15px', fontWeight: isActive ? 'bold' : 'normal', flexShrink: 0 }}
                      >
                        <Icon size={18} className={isActive ? 'text-primary' : 'text-muted'} />
                        <span className={isActive ? '' : 'text-muted'}>{tab.label}</span>
                        {isActive && (
                          <motion.div 
                            layoutId="profileTabIndicator"
                            className="position-absolute bottom-0 left-0 right-0 bg-primary"
                            style={{ height: '3px' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card-body p-4 p-md-5" style={{ minHeight: '400px' }}>
                
                {activeTab === 'about' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">About Me</h5>
                    <p className="text-muted mb-5" style={{ lineHeight: '1.7' }}>
                      I am a dedicated parent actively utilizing the Urora Guardian platform to ensure the digital safety and well-being of my children. I prefer to maintain an open dialogue about technology while using these tools to safeguard against inappropriate content and excessive screen time.
                    </p>

                    <h5 className="font-weight-bold mb-4">Monitored Children</h5>
                    <div className="d-flex flex-column gap-3">
                      {[
                        { name: 'Emma', device: 'iPhone 13', avatar: 'https://i.pravatar.cc/150?u=emma' },
                        { name: 'Noah', device: 'Galaxy S22', avatar: 'https://i.pravatar.cc/150?u=noah' },
                        { name: 'Sophia', device: 'iPad Pro', avatar: 'https://i.pravatar.cc/150?u=sophia' }
                      ].map(child => (
                        <div key={child.name} className="d-flex align-items-center gap-3 p-3 bg-light rounded-lg">
                          <img src={child.avatar} alt={child.name} className="rounded-circle shadow-sm" width="48" height="48" />
                          <div className="flex-grow-1">
                            <h6 className="m-0 font-weight-bold">{child.name}</h6>
                            <p className="m-0 text-muted small">{child.device}</p>
                          </div>
                          <Link to="/dashboard/live-activity" className="btn btn-sm btn-outline-primary rounded-pill">View Dashboard</Link>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'activity' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">Recent Account Activity</h5>
                    <div className="position-relative ml-3 border-left border-light pl-4 pt-2 pb-2">
                      {[
                        { title: 'Password Changed', time: 'Yesterday at 4:30 PM', desc: 'You successfully updated your account password.' },
                        { title: 'New Device Added', time: 'Oct 12 at 10:00 AM', desc: 'Added Noah\'s Galaxy S22 to your monitored devices.' },
                        { title: 'Subscription Renewed', time: 'Oct 1 at 12:00 PM', desc: 'Your Urora Premium plan was automatically renewed.' },
                        { title: 'Report Downloaded', time: 'Sep 28 at 9:15 AM', desc: 'You exported Emma\'s weekly activity report.' }
                      ].map((item, idx) => (
                        <div key={idx} className="mb-4 position-relative">
                          <div className="position-absolute bg-white rounded-circle border border-primary d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', left: '-36px', top: '0' }}>
                            <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                          </div>
                          <h6 className="m-0 font-weight-bold">{item.title}</h6>
                          <p className="text-muted small mb-1">{item.time}</p>
                          <p className="text-muted m-0">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="font-weight-bold mb-4">Account Settings</h5>
                    
                    <form>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label className="text-muted font-weight-bold small">First Name</label>
                          <input type="text" className="form-control rounded-lg bg-light border-0 py-4" defaultValue="Sarah" />
                        </div>
                        <div className="col-md-6">
                          <label className="text-muted font-weight-bold small">Last Name</label>
                          <input type="text" className="form-control rounded-lg bg-light border-0 py-4" defaultValue="Carlile" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="text-muted font-weight-bold small">Email Address</label>
                        <input type="email" className="form-control rounded-lg bg-light border-0 py-4" defaultValue="sarah.carlile@example.com" />
                      </div>

                      <h5 className="font-weight-bold mb-4 mt-5">Notification Preferences</h5>
                      <div className="d-flex align-items-center justify-content-between mb-3 p-3 bg-light rounded-lg">
                        <div>
                          <h6 className="m-0 font-weight-bold">Email Alerts</h6>
                          <p className="m-0 text-muted small">Receive daily summary reports via email</p>
                        </div>
                        <div className="custom-control custom-switch">
                          <input type="checkbox" className="custom-control-input" id="emailSwitch" defaultChecked />
                          <label className="custom-control-label" htmlFor="emailSwitch"></label>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4 p-3 bg-light rounded-lg">
                        <div>
                          <h6 className="m-0 font-weight-bold">Push Notifications</h6>
                          <p className="m-0 text-muted small">Receive instant alerts for high-risk activity</p>
                        </div>
                        <div className="custom-control custom-switch">
                          <input type="checkbox" className="custom-control-input" id="pushSwitch" defaultChecked />
                          <label className="custom-control-label" htmlFor="pushSwitch"></label>
                        </div>
                      </div>

                      <div className="text-right mt-4">
                        <button type="button" className="btn btn-primary rounded-pill px-5 font-weight-bold shadow-sm py-2">
                          Save Changes
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
