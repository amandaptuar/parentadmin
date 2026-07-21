import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChildProvider } from './context/ChildContext';
import Preloader from './components/Preloader';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

// Parenting Imports
import {
  LiveActivity, CallsMonitoring, SmsMonitoring, WhatsappMonitoring,
  SocialMonitoring, GalleryMonitoring, LocationTracking,
  ScreenTime, Reports, NotificationsCenter, HelpCenter
} from './pages/parenting';

// Guard: only allow access if a valid JWT token exists
function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('vigil_token');
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

// Guard: logged-in users shouldn't be able to open login/register/forgot-password
// (Vigil_025 — previously these pages stayed accessible even with an active session).
function GuestRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('vigil_token');
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

function App() {

  // Vigil_015 — after logout, the browser's back button could restore the
  // dashboard from bfcache (in-memory snapshot) even though localStorage was
  // already cleared. `pageshow` fires on that restore; if there's no token
  // anymore, force a real reload so the router re-evaluates ProtectedRoute.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted && !localStorage.getItem('vigil_token')) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const getBasename = () => {
    const p = window.location.pathname;
    if (p.startsWith('/parentsaccess')) return '/parentsaccess';
    if (p.startsWith('/parent')) return '/parent';
    return '';
  };

  return (
    <ChildProvider>
    <Router basename={getBasename()}>
      <Preloader />
      <Routes>
        {/* Guest-only pages — redirect away if already logged in (Vigil_025) */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Protected dashboard layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help-center" element={<HelpCenter />} />
          
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
    </ChildProvider>
  );
}

export default App;
