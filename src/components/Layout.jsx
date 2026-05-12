import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Re-initialize sidebar and tooltip widgets after layout mounts
    const timer = setTimeout(() => {
      if (window.UroraApp && typeof window.UroraApp.init === 'function') {
        try { window.UroraApp.init(); } catch (e) { console.error(e); }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('urora_logged_in');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    document.body.classList.toggle('enlarged');
  };

  return (
    <div id="wrapper">
      <Sidebar onClose={toggleMobileMenu} />
      <div className="content-page">
        <div className="content">
          <Topbar onLogout={handleLogout} onToggleMenu={toggleMobileMenu} />
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
