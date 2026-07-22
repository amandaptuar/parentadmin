import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Camera } from 'lucide-react';
import { getChildSocial } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const SocialMonitoring = () => {
  const { selectedChild } = useChild();
  const [apps, setApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const data = await getChildSocial(selectedChild._id);
      const list = data.apps || [];
      setApps(list);
      setActiveApp(list[0] || null);
    } catch (err) {
      console.error(err);
      setApps([]);
      setActiveApp(null);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Flatten all messages across conversations for the active app, newest first.
  const activityFeed = (activeApp?.conversations || [])
    .flatMap(c => c.messages.map(m => ({ ...m, contact: c.contact })))
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 20);

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <Users className="text-primary" /> Social Media Monitoring
            </h4>
            <ChildSelector />
          </div>
        </div>

        {!selectedChild ? (
          <div className="text-center text-muted py-5">Select a child to view social media activity.</div>
        ) : loading ? (
          <div className="text-center text-muted py-5">
            <div className="spinner-border spinner-border-sm me-2"></div> Loading...
          </div>
        ) : apps.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-lg">
            <div className="card-body text-center py-5 text-muted">
              <Camera size={40} className="mb-3 opacity-50" />
              <h5>No social app activity captured yet</h5>
              <p className="m-0">Notifications and on-screen text from apps like Instagram, Snapchat, and Telegram will appear here once captured on the child device.</p>
            </div>
          </div>
        ) : (
          <>
            {/* App Tabs — only apps that actually have captured data */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {apps.map(app => {
                    const isActive = activeApp?.app === app.app;
                    const msgCount = app.conversations.reduce((s, c) => s + c.messages.length, 0);
                    return (
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        key={app.app}
                        onClick={() => setActiveApp(app)}
                        className={`btn rounded-lg px-4 py-3 d-flex align-items-center gap-2 border-0 shadow-sm ${isActive ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                        style={{ minWidth: '160px' }}
                      >
                        <MessageCircle size={20} />
                        <span className="font-weight-bold">{app.app}</span>
                        <span className={`badge rounded-pill ${isActive ? 'badge-light' : 'badge-secondary'}`}>{msgCount}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="row">
              {/* Conversations for this app */}
              <div className="col-lg-5 mb-4">
                <div className="card shadow-sm border-0 rounded-lg h-100">
                  <div className="card-body">
                    <h5 className="header-title mb-4">Conversations</h5>
                    {(activeApp?.conversations || []).map((c, i) => (
                      <div key={i} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: 40, height: 40 }}>
                          {c.contact.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <h6 className="m-0 text-truncate">{c.contact}</h6>
                          <p className="m-0 text-truncate text-muted small">{c.messages[c.messages.length - 1]?.text}</p>
                        </div>
                        <small className="text-muted flex-shrink-0">{timeAgo(c.lastTime)}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="col-lg-7 mb-4">
                <div className="card shadow-sm border-0 rounded-lg h-100">
                  <div className="card-body">
                    <h5 className="header-title mb-4">Recent Activity — {activeApp?.app}</h5>
                    <div className="timeline">
                      {activityFeed.length === 0 ? (
                        <p className="text-muted">No recent activity.</p>
                      ) : activityFeed.map((a) => (
                        <div key={a.id} className="d-flex mb-3">
                          <div className="mr-3 mt-1">
                            <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                              <MessageCircle size={16} />
                            </div>
                          </div>
                          <div className="flex-grow-1 border-bottom pb-2">
                            <p className="m-0 text-dark" style={{ fontSize: '14px' }}>
                              <b>{a.contact}</b>: {a.text}
                            </p>
                            <small className="text-muted">{timeAgo(a.time)}</small>
                          </div>
                        </div>
                      ))}
                    </div>
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
