import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Preloader from './components/Preloader';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';

// Parenting Imports
import {
  LiveActivity, CallsMonitoring, SmsMonitoring, WhatsappMonitoring,
  SocialMonitoring, GalleryMonitoring, LocationTracking,
  ScreenTime, Reports, NotificationsCenter
} from './pages/parenting';

// Guard: only allow access to dashboard/profile if logged in
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('urora_logged_in') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.UroraApp && typeof window.UroraApp.init === 'function') {
        try {
          window.UroraApp.init();
        } catch (e) {
          console.error("UroraApp init error:", e);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader />
      <Routes>
        {/* Public pages - always accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Parent Monitoring Routes */}
          <Route path="/dashboard/live-activity" element={<LiveActivity />} />
          <Route path="/dashboard/calls/*" element={<CallsMonitoring />} />
          <Route path="/dashboard/sms/*" element={<SmsMonitoring />} />
          <Route path="/dashboard/whatsapp/*" element={<WhatsappMonitoring />} />
          <Route path="/dashboard/social-media/*" element={<SocialMonitoring />} />
          <Route path="/dashboard/gallery/*" element={<GalleryMonitoring />} />
          <Route path="/dashboard/location/*" element={<LocationTracking />} />
          <Route path="/dashboard/screen-time/*" element={<ScreenTime />} />
          <Route path="/dashboard/reports/*" element={<Reports />} />
          <Route path="/dashboard/notifications/*" element={<NotificationsCenter />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
