import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';

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
    localStorage.removeItem('vigil_token');
    localStorage.removeItem('vigil_user');
    localStorage.removeItem('vigil_selected_child');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    document.body.classList.toggle('enlarged');
  };

  return (
    <div id="wrapper">
      <ToastContainer />
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
