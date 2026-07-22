import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, ShieldAlert, MapPin, Battery, Smartphone, WifiOff, Trash2
} from 'lucide-react';
import { getMyAlerts } from '../../services/api';

const TYPE_META = {
  sos_panic:          { title: 'SOS Alert',            icon: ShieldAlert, color: 'danger',  group: 'security' },
  geofence_violation: { title: 'Left a Safe Zone',      icon: MapPin,      color: 'warning', group: 'location' },
  device_offline:      { title: 'Device Went Offline',   icon: WifiOff,     color: 'secondary', group: 'system' },
  sim_changed:         { title: 'SIM Card Changed',      icon: ShieldAlert, color: 'warning', group: 'security' },
  low_battery:         { title: 'Low Battery',           icon: Battery,     color: 'info',    group: 'system' },
  app_uninstall:       { title: 'App Removed',           icon: Smartphone,  color: 'primary', group: 'activity' },
};

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

export const NotificationsCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyAlerts(50);
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const tabs = [
    { id: 'all',      label: 'All Alerts' },
    { id: 'unread',   label: 'Unresolved' },
    { id: 'security', label: 'Security' },
    { id: 'location', label: 'Location' },
  ];

  const filtered = alerts.filter(a => {
    const meta = TYPE_META[a.type] || { group: 'system' };
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return ['open', 'assigned'].includes(a.status);
    return meta.group === activeTab;
  });

  const hasUnresolved = alerts.some(a => ['open', 'assigned'].includes(a.status));

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <div className="position-relative">
                <Bell className="text-primary" />
                {hasUnresolved && (
                  <span className="position-absolute rounded-circle bg-danger" style={{ width: '8px', height: '8px', top: 0, right: 0 }}></span>
                )}
              </div>
              Notifications Center
            </h4>
            <button className="btn btn-outline-primary rounded-pill shadow-sm font-weight-bold btn-sm" onClick={fetchAlerts}>
              Refresh
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">

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

            <div className="card shadow-sm border-0 rounded-lg">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2"></div> Loading...
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    <AnimatePresence>
                      {filtered.length > 0 ? filtered.map((a, index) => {
                        const meta = TYPE_META[a.type] || { title: a.type, icon: Bell, color: 'secondary' };
                        const Icon = meta.icon;
                        const unresolved = ['open', 'assigned'].includes(a.status);
                        return (
                          <motion.li
                            key={a._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`list-group-item p-4 border-0 position-relative ${unresolved ? 'bg-light' : ''}`}
                            style={{ borderBottom: '1px solid #f8f9fa' }}
                          >
                            {unresolved && (
                              <div className="position-absolute bg-primary" style={{ left: 0, top: 0, bottom: 0, width: '4px' }}></div>
                            )}
                            <div className="d-flex align-items-start gap-3">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center text-${meta.color} shadow-sm`}
                                style={{ width: '48px', height: '48px', background: `var(--bs-${meta.color}-bg-subtle, #f8f9fa)`, flexShrink: 0 }}>
                                <Icon size={22} />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <h6 className={`m-0 ${unresolved ? 'font-weight-bold text-dark' : 'text-muted'}`}>{meta.title}</h6>
                                  <small className="text-muted">{timeAgo(a.createdAt)}</small>
                                </div>
                                <p className="m-0" style={{ color: unresolved ? '#495057' : '#6c757d', fontSize: '14.5px' }}>
                                  {a.message || `${a.child_name ? a.child_name + ' — ' : ''}${meta.title}`}
                                </p>
                              </div>
                            </div>
                          </motion.li>
                        );
                      }) : (
                        <div className="text-center py-5 text-muted">
                          <Bell size={48} className="mb-3 opacity-25" />
                          <h5>No alerts</h5>
                          <p>You're all caught up! There are no alerts in this category.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
