import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, PhoneCall, MessageSquare, MapPin, Wifi, Battery, Smartphone, Clock, WifiOff } from 'lucide-react';
import { getLiveStatus, getChildSms, getChildCalls, getChildApps } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

export const LiveActivity = () => {
  const { selectedChild } = useChild();
  const [liveStatus, setLiveStatus]   = useState(null);
  const [stats, setStats]             = useState({ calls: 0, messages: 0, screenMinutes: 0 });
  const [loading, setLoading]         = useState(false);

  const fetchAll = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const [live, sms, calls, apps] = await Promise.allSettled([
        getLiveStatus(selectedChild._id),
        getChildSms(selectedChild._id, { limit: 1 }),
        getChildCalls(selectedChild._id, { limit: 1 }),
        getChildApps(selectedChild._id),
      ]);

      if (live.status === 'fulfilled')  setLiveStatus(live.value);
      const msgTotal  = sms.status   === 'fulfilled' ? (sms.value?.total   || 0) : 0;
      const callTotal = calls.status === 'fulfilled' ? (calls.value?.total  || 0) : 0;
      const screenMin = apps.status  === 'fulfilled' ? (apps.value?.totalScreenTimeMinutes || 0) : 0;
      setStats({ calls: callTotal, messages: msgTotal, screenMinutes: screenMin });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const isOnline  = liveStatus?.isOnline || false;
  const battery   = liveStatus?.batteryInfo?.level ?? liveStatus?.battery ?? null;
  const h = Math.floor(stats.screenMinutes / 60);
  const m = stats.screenMinutes % 60;

  const statCards = [
    { label: 'Total Calls Today', value: stats.calls,   icon: PhoneCall,    bg: 'rgba(63,81,181,0.1)',   iconClass: 'text-primary' },
    { label: 'Messages',          value: stats.messages, icon: MessageSquare, bg: 'rgba(0,150,136,0.1)',   iconClass: 'text-success' },
    { label: 'Screen Time',       value: `${h}h ${m}m`, icon: Clock,         bg: 'rgba(255,180,48,0.1)',  iconClass: 'text-warning' },
  ];

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <Activity className="text-primary" /> Live Activity Overview
            </h4>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end">
              <ChildSelector />
            </div>
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <Smartphone size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to see live activity</h5>
          </div>
        ) : (
          <>
            {/* Device status bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body py-3 d-flex align-items-center gap-4 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                  <Smartphone size={18} className="text-secondary" />
                  <span className="font-weight-bold">{selectedChild.name}</span>
                  <span className="text-muted" style={{ fontSize: 13 }}>({selectedChild.deviceName || 'Device'})</span>
                </div>
                {battery !== null && (
                  <div className="d-flex align-items-center gap-2">
                    <Battery size={18} className={battery > 20 ? 'text-success' : 'text-danger'} />
                    <span>{battery}%</span>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2">
                  {isOnline
                    ? <><Wifi size={18} className="text-primary" /><span className="text-success font-weight-bold">Online</span></>
                    : <><WifiOff size={18} className="text-muted" /><span className="text-muted">Offline</span></>
                  }
                </div>
                {loading && <span className="text-muted" style={{ fontSize: 12 }}>Refreshing...</span>}
              </div>
            </div>

            {/* Stat cards */}
            <div className="row">
              {statCards.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="col-md-4 mb-4">
                    <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>{s.label}</p>
                            <h3 className="m-0 font-weight-bold">{s.value}</h3>
                          </div>
                          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: s.bg }}>
                            <Icon className={s.iconClass} size={24} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Location */}
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card shadow-sm border-0 rounded-lg">
                  <div className="card-body py-3 d-flex align-items-center gap-2">
                    <MapPin size={18} className="text-danger" />
                    <span className="font-weight-bold">Last Known Location</span>
                    <a href="/dashboard/location" className="btn btn-sm btn-outline-primary ms-auto rounded-pill px-3">
                      View Map →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
