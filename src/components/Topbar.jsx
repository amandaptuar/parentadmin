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