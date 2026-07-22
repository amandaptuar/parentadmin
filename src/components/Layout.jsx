import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';
import ToastContainer from './ToastContainer';

export default function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
    setCollapsed(c => !c);
  };

  return (
    <div id="wrapper">
      <ToastContainer />
      <Sidebar onClose={toggleMobileMenu} collapsed={collapsed} />
      <div className="content-page" style={{ marginLeft: collapsed ? 0 : undefined, transition: 'margin-left 0.25s ease' }}>
        <div className="content">
          <Topbar onLogout={handleLogout} onToggleMenu={toggleMobileMenu} />
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
