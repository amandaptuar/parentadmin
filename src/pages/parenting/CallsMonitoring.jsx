import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, RefreshCw } from 'lucide-react';
import { getChildCalls } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

export const CallsMonitoring = () => {
  const { selectedChild } = useChild();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch]       = useState('');
  const [calls, setCalls]         = useState([]);
  const [stats, setStats]         = useState({});
  const [loading, setLoading]     = useState(false);

  const tabs = [
    { id: 'all',      label: 'All',      icon: PhoneCall    },
    { id: 'INCOMING', label: 'Incoming', icon: PhoneIncoming },
    { id: 'OUTGOING', label: 'Outgoing', icon: PhoneOutgoing },
    { id: 'MISSED',   label: 'Missed',   icon: PhoneMissed  },
  ];

  const fetchCalls = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const params = activeTab !== 'all' ? { type: activeTab } : {};
      const data = await getChildCalls(selectedChild._id, params);
      setCalls(data.calls || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error(err);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChild, activeTab]);

  useEffect(() => { fetchCalls(); }, [fetchCalls]);

  const getCallIcon = (type = '') => {
    if (/incoming/i.test(type)) return <PhoneIncoming size={16} className="text-success" />;
    if (/outgoing/i.test(type)) return <PhoneOutgoing size={16} className="text-primary" />;
    if (/missed/i.test(type))   return <PhoneMissed size={16} className="text-danger" />;
    return <PhoneCall size={16} className="text-muted" />;
  };

  const formatDuration = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = secs % 60;
    return m ? `${m}m ${s}s` : `${s}s`;
  };

  const formatTime = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  const filtered = calls.filter(c =>
    !search || (c.name || c.number || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <PhoneCall className="text-primary" /> Calls Monitoring
            </h4>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <ChildSelector />
            <button className="btn btn-light btn-sm" onClick={fetchCalls}><RefreshCw size={14} /></button>
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <PhoneCall size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to view call logs</h5>
          </div>
        ) : (
          <>
            {/* Stats row */}
            {Object.keys(stats).length > 0 && (
              <div className="row mb-4">
                {[
                  { label: 'Total Calls',    value: stats.totalCalls  || 0, color: 'text-primary'  },
                  { label: 'Incoming',       value: stats.incoming    || 0, color: 'text-success'  },
                  { label: 'Outgoing',       value: stats.outgoing    || 0, color: 'text-info'     },
                  { label: 'Missed',         value: stats.missed      || 0, color: 'text-danger'   },
                ].map((s, i) => (
                  <div key={i} className="col-6 col-md-3 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                      <div className="card-body py-3">
                        <h4 className={`m-0 font-weight-bold ${s.color}`}>{s.value}</h4>
                        <small className="text-muted">{s.label}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body py-3 d-flex gap-3 flex-wrap align-items-center">
                <div className="d-flex gap-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 ${activeTab === tab.id ? 'btn-primary' : 'btn-light'}`}
                        style={{ fontSize: 12 }}>
                        <Icon size={13} /> {tab.label}
                      </button>
                    );
                  })}
                </div>
                <div className="position-relative ms-auto" style={{ width: 220 }}>
                  <Search className="position-absolute text-muted" size={14} style={{ left: 10, top: 9 }} />
                  <input type="text" className="form-control form-control-sm rounded-pill"
                    style={{ paddingLeft: 30 }} placeholder="Search name or number..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Call list */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-4 text-muted">No calls found.</div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {filtered.map((call, i) => (
                      <motion.li key={call._id || i}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="list-group-item border-0 px-4 py-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                              style={{ width: 40, height: 40 }}>
                              {getCallIcon(call.callType)}
                            </div>
                            <div>
                              <h6 className="m-0 font-weight-bold">{call.name || 'Unknown'}</h6>
                              <small className="text-muted">{call.number}</small>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-muted" style={{ fontSize: 12 }}>{formatTime(call.timestamp)}</div>
                            <small className="text-muted">{formatDuration(call.duration)}</small>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
