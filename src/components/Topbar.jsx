<<<<<<< Updated upstream
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Bell, User, LogOut, HelpCircle, Menu } from 'lucide-react';
import { getUser, logout } from '../services/api';

export default function Topbar({ onLogout, onToggleMenu }) {
  const navigate = useNavigate();
  const user = getUser();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'messages' | 'notifications' | 'profile' | null
  const topbarRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (topbarRef.current && !topbarRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleLogoutClick = () => {
    logout();
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <div className="topbar" ref={topbarRef}>
      <nav className="navbar-custom d-flex align-items-center justify-content-between px-3">
        {/* Left mobile menu toggle */}
        <div className="d-flex align-items-center gap-2">
          <button 
            type="button" 
            className="btn btn-link text-white p-0 border-0" 
            onClick={onToggleMenu}
            title="Toggle Menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Right Nav Icons */}
        <div className="d-flex align-items-center gap-3 ms-auto position-relative">
          
          {/* SMS / Messages Icon */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-link text-white p-2 position-relative border-0 rounded-circle"
              onClick={() => toggleDropdown('messages')}
              title="Messages"
            >
              <Mail size={20} />
            </button>

            {activeDropdown === 'messages' && (
              <div 
                className="dropdown-menu dropdown-menu-end show p-0 shadow-lg border-0 rounded-3 mt-2" 
                style={{ width: '280px', right: 0, left: 'auto', zIndex: 1050 }}
              >
                <div className="p-3 bg-primary text-white rounded-top-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">SMS & Messages</h6>
                </div>
                <div className="p-3 text-center text-muted small">
                  Monitor live messages and SMS activity.
                </div>
                <div className="p-2 border-top text-center bg-light rounded-bottom-3">
                  <Link 
                    to="/dashboard/sms" 
                    className="text-primary font-weight-bold text-decoration-none small"
                    onClick={() => setActiveDropdown(null)}
                  >
                    View All Messages →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell Icon */}
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-link text-white p-2 position-relative border-0 rounded-circle"
              onClick={() => toggleDropdown('notifications')}
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            {activeDropdown === 'notifications' && (
              <div 
                className="dropdown-menu dropdown-menu-end show p-0 shadow-lg border-0 rounded-3 mt-2" 
                style={{ width: '280px', right: 0, left: 'auto', zIndex: 1050 }}
              >
                <div className="p-3 bg-primary text-white rounded-top-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">Notifications</h6>
                </div>
                <div className="p-3 text-center text-muted small">
                  No new security alerts. Your children are protected.
                </div>
                <div className="p-2 border-top text-center bg-light rounded-bottom-3">
                  <Link 
                    to="/dashboard/notifications" 
                    className="text-primary font-weight-bold text-decoration-none small"
                    onClick={() => setActiveDropdown(null)}
                  >
                    View Notification Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Dropdown */}
          <div className="position-relative ms-2">
            <button
              type="button"
              className="btn p-0 border-0 rounded-circle d-flex align-items-center justify-content-center bg-white text-primary font-weight-bold shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '16px' }}
              onClick={() => toggleDropdown('profile')}
              title="User Profile"
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'P'}
            </button>

            {activeDropdown === 'profile' && (
              <div 
                className="dropdown-menu dropdown-menu-end show p-2 shadow-lg border-0 rounded-3 mt-2" 
                style={{ width: '220px', right: 0, left: 'auto', zIndex: 1050 }}
              >
                <div className="px-3 py-2 border-bottom">
                  <p className="m-0 font-weight-bold text-dark">{user?.name || 'Parent User'}</p>
                  <small className="text-muted d-block text-truncate">{user?.email || 'parent@vigil.com'}</small>
                </div>

                <Link 
                  to="/profile" 
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded mt-1"
                  onClick={() => setActiveDropdown(null)}
                >
                  <User size={16} className="text-secondary" />
                  <span>My Profile</span>
                </Link>

                <Link 
                  to="/help-center" 
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded"
                  onClick={() => setActiveDropdown(null)}
                >
                  <HelpCircle size={16} className="text-secondary" />
                  <span>Help Center</span>
                </Link>

                <div className="dropdown-divider my-1"></div>

                <button 
                  type="button" 
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded text-danger"
                  onClick={handleLogoutClick}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
}
=======
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser, getMyAlerts } from '../services/api';

const ALERT_LABELS = {
  sos_panic: { title: 'SOS Alert', icon: 'mdi-alert-octagon', color: 'bg-danger' },
  geofence_violation: { title: 'Left safe zone', icon: 'mdi-map-marker-alert', color: 'bg-warning' },
  device_offline: { title: 'Device went offline', icon: 'mdi-wifi-off', color: 'bg-secondary' },
  sim_changed: { title: 'SIM card changed', icon: 'mdi-sim-alert', color: 'bg-warning' },
  low_battery: { title: 'Low battery', icon: 'mdi-battery-alert', color: 'bg-warning' },
  app_uninstall: { title: 'App removed', icon: 'mdi-delete-alert', color: 'bg-secondary' },
};

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Topbar({ onLogout, onToggleMenu }) {
  const user = getUser();
  const [alerts, setAlerts] = useState([]);
  const [unresolvedCount, setUnresolvedCount] = useState(0);

  useEffect(() => {
    getMyAlerts(5)
      .then((res) => {
        setAlerts(res.alerts || []);
        setUnresolvedCount(res.unresolvedCount || 0);
      })
      .catch(() => { /* no alerts yet — leave empty */ });
  }, []);

  const initial = (user?.name || user?.email || 'P').charAt(0).toUpperCase();

  return (
    <div className="topbar">
      <nav className="navbar-custom">
        <ul className="list-inline float-right mb-0 mr-3">

          {/* Notifications dropdown — real alerts for this parent's children */}
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <i className="ti-bell noti-icon"></i>
              {unresolvedCount > 0 && (
                <span className="badge badge-danger a-animate-blink noti-icon-badge">{unresolvedCount}</span>
              )}
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
              <div className="dropdown-item noti-title">
                <h5><span className="badge badge-danger float-right">{unresolvedCount}</span>Alerts</h5>
              </div>
              {alerts.length === 0 ? (
                <div className="dropdown-item text-muted text-center py-3" style={{ fontSize: 13 }}>
                  No alerts yet
                </div>
              ) : (
                alerts.map((a) => {
                  const meta = ALERT_LABELS[a.type] || { title: a.type, icon: 'mdi-bell', color: 'bg-secondary' };
                  return (
                    <a key={a._id} href="#" className="dropdown-item notify-item">
                      <div className={`notify-icon ${meta.color}`}><i className={`mdi ${meta.icon}`}></i></div>
                      <p className="notify-details">
                        <b>{meta.title}</b>
                        <small className="text-muted d-block">
                          {a.child_name ? `${a.child_name} · ` : ''}{timeAgo(a.createdAt)}
                        </small>
                      </p>
                    </a>
                  );
                })
              )}
              <Link to="/dashboard/notifications" className="dropdown-item notify-item">View All</Link>
            </div>
          </li>

          {/* User / Profile dropdown */}
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect nav-user d-flex align-items-center" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <span className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 36, height: 36, fontSize: 15 }}>
                {initial}
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-right profile-dropdown">
              <div className="dropdown-item noti-title">
                <h5 className="m-0">{user?.name || 'Parent'}</h5>
                <small className="text-muted">{user?.email || ''}</small>
              </div>
              <Link className="dropdown-item" to="/profile">
                <i className="mdi mdi-account-circle m-r-5 text-muted"></i> Profile
              </Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onLogout && onLogout(); }}>
                <i className="mdi mdi-logout m-r-5 text-muted"></i> Logout
              </a>
            </div>
          </li>
        </ul>

        <ul className="list-inline menu-left mb-0">
          <li className="float-left">
            <button className="button-menu-mobile open-left waves-light waves-effect" onClick={onToggleMenu}>
              <i className="mdi mdi-menu"></i>
            </button>
          </li>
        </ul>
        <div className="clearfix"></div>
      </nav>
    </div>
  );
}
>>>>>>> Stashed changes
