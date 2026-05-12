import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, ShieldAlert, Navigation, Settings, 
  CheckCircle, Battery, MessageSquare, MapPin
} from 'lucide-react';

const notificationsData = [
  { id: 1, type: 'security', title: 'High Risk Detected', desc: 'Inappropriate language detected in WhatsApp messages.', time: '10 mins ago', icon: ShieldAlert, color: 'danger', unread: true },
  { id: 2, type: 'location', title: 'Geofence Alert', desc: 'Emma has left the "School" safe zone.', time: '1 hour ago', icon: MapPin, color: 'warning', unread: true },
  { id: 3, type: 'system', title: 'Low Battery', desc: 'Noah\'s device battery is below 15%.', time: '2 hours ago', icon: Battery, color: 'info', unread: false },
  { id: 4, type: 'activity', title: 'App Installed', desc: 'A new application "TikTok" was installed on Emma\'s device.', time: 'Yesterday', icon: Settings, color: 'primary', unread: false },
  { id: 5, type: 'system', title: 'Weekly Report Ready', desc: 'Your weekly summary report for Oct 10 - Oct 17 is available.', time: 'Yesterday', icon: CheckCircle, color: 'success', unread: false },
];

export const NotificationsCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(notificationsData);

  const tabs = [
    { id: 'all', label: 'All Alerts' },
    { id: 'unread', label: 'Unread' },
    { id: 'security', label: 'Security' },
    { id: 'location', label: 'Location' },
  ];

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notif.unread;
    return notif.type === activeTab;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const getIconBgColor = (color) => {
    switch(color) {
      case 'danger': return 'rgba(239, 79, 76, 0.1)';
      case 'warning': return 'rgba(255, 180, 48, 0.1)';
      case 'info': return 'rgba(0, 188, 212, 0.1)';
      case 'success': return 'rgba(0, 150, 136, 0.1)';
      case 'primary': return 'rgba(63, 81, 181, 0.1)';
      default: return '#f8f9fa';
    }
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <div className="position-relative">
                <Bell className="text-primary" />
                {notifications.some(n => n.unread) && (
                  <span className="position-absolute rounded-circle bg-danger" style={{ width: '8px', height: '8px', top: 0, right: 0 }}></span>
                )}
              </div>
              Notifications Center
            </h4>
            
            <button 
              className="btn btn-outline-primary rounded-pill shadow-sm font-weight-bold btn-sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            
            {/* Filter Tabs */}
            <div className="d-flex gap-2 mb-4 bg-white p-2 rounded-pill shadow-sm" style={{ width: 'max-content' }}>
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn rounded-pill px-4 py-2 border-0 ${isActive ? 'btn-primary shadow-sm' : 'btn-light text-muted bg-transparent'}`}
                    style={{ transition: 'all 0.3s', fontSize: '14px', fontWeight: isActive ? 'bold' : 'normal' }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Notifications List */}
            <div className="card shadow-sm border-0 rounded-lg">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  <AnimatePresence>
                    {filteredNotifications.length > 0 ? filteredNotifications.map((notif, index) => {
                      const Icon = notif.icon;
                      return (
                        <motion.li 
                          key={notif.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`list-group-item p-4 border-0 position-relative ${notif.unread ? 'bg-light' : ''}`}
                          style={{ borderBottom: '1px solid #f8f9fa !important' }}
                        >
                          {notif.unread && (
                            <div className="position-absolute bg-primary" style={{ left: 0, top: 0, bottom: 0, width: '4px' }}></div>
                          )}
                          <div className="d-flex align-items-start gap-3">
                            <div className={`rounded-circle d-flex align-items-center justify-content-center text-${notif.color} shadow-sm`} style={{ width: '48px', height: '48px', background: getIconBgColor(notif.color), flexShrink: 0 }}>
                              <Icon size={24} />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className={`m-0 ${notif.unread ? 'font-weight-bold text-dark' : 'text-muted'}`}>{notif.title}</h6>
                                <small className="text-muted">{notif.time}</small>
                              </div>
                              <p className="m-0 mb-2" style={{ color: notif.unread ? '#495057' : '#6c757d', fontSize: '14.5px' }}>{notif.desc}</p>
                              
                              {/* Quick Actions based on type */}
                              {notif.type === 'security' && (
                                <button onClick={() => alert('Opening security review modal...')} className="btn btn-sm btn-outline-danger rounded-pill mt-1">Review Flagged Content</button>
                              )}
                              {notif.type === 'location' && (
                                <button onClick={() => alert('Navigating to Live Tracking Map...')} className="btn btn-sm btn-outline-warning rounded-pill mt-1">View on Map</button>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      );
                    }) : (
                      <div className="text-center py-5 text-muted">
                        <Bell size={48} className="mb-3 opacity-25" />
                        <h5>No notifications</h5>
                        <p>You're all caught up! There are no alerts in this category.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
