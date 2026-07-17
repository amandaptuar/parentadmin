import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, MonitorSmartphone, RefreshCw, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChildApps } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

const APP_COLORS = [
  '#3f51b5', '#e91e63', '#ff5722', '#009688', '#ff9800',
  '#9c27b0', '#2196f3', '#4caf50', '#f44336', '#00bcd4',
];

function todayIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export const ScreenTime = () => {
  const { selectedChild } = useChild();
  const [apps, setApps]               = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [day, setDay]                 = useState(todayIST());
  const [loading, setLoading]         = useState(false);

  const fetchApps = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const data = await getChildApps(selectedChild._id, { day });
      setApps(data.apps || []);
      setTotalMinutes(data.totalScreenTimeMinutes || 0);
    } catch (err) {
      console.error(err);
      setApps([]);
      setTotalMinutes(0);
    } finally {
      setLoading(false);
    }
  }, [selectedChild, day]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  const chartData = apps.slice(0, 10).map((a, i) => ({
    name: a.appName?.length > 12 ? a.appName.slice(0, 12) + '…' : (a.appName || 'Unknown'),
    minutes: a.usageInfo?.displayMinutes ?? a.usageInfo?.dailyMinutes ?? 0,
    fill: APP_COLORS[i % APP_COLORS.length],
  }));

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MonitorSmartphone className="text-primary" /> Screen Time
            </h4>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
            <ChildSelector />
            <div className="input-group" style={{ width: 170 }}>
              <span className="input-group-text bg-white border-end-0" style={{ fontSize: 13 }}>
                <CalendarDays size={14} className="text-muted" />
              </span>
              <input type="date" className="form-control form-control-sm border-start-0"
                value={day} max={todayIST()} onChange={e => setDay(e.target.value)} />
            </div>
            <button className="btn btn-light btn-sm" onClick={fetchApps}><RefreshCw size={14} /></button>
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <MonitorSmartphone size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to view screen time</h5>
          </div>
        ) : (
          <>
            {/* Total summary card */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm bg-primary text-white text-center">
                  <div className="card-body py-4">
                    <Clock size={28} className="mb-2 opacity-75" />
                    <h2 className="m-0 font-weight-bold">{h}h {m}m</h2>
                    <p className="m-0 opacity-75 mt-1">Total Screen Time</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm text-center">
                  <div className="card-body py-4">
                    <h2 className="m-0 font-weight-bold text-dark">{apps.length}</h2>
                    <p className="m-0 text-muted mt-1">Apps Used</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm text-center">
                  <div className="card-body py-4">
                    <h2 className="m-0 font-weight-bold text-dark">
                      {apps.length > 0 ? Math.round(totalMinutes / apps.length) : 0}m
                    </h2>
                    <p className="m-0 text-muted mt-1">Avg Per App</p>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading...
              </div>
            ) : apps.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5 text-muted">
                No app usage data for {day}.
              </div>
            ) : (
              <div className="row">

                {/* Bar chart */}
                <div className="col-lg-7 mb-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <h6 className="font-weight-bold mb-3">Top Apps by Usage (minutes)</h6>
                      <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12 }} width={100} />
                            <Tooltip
                              cursor={{ fill: 'rgba(63,81,181,0.07)' }}
                              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              formatter={(v) => [`${v} min`, 'Usage']}
                            />
                            <Bar dataKey="minutes" radius={[0, 4, 4, 0]} barSize={18}
                              fill="#3f51b5"
                              label={{ position: 'right', fontSize: 11, fill: '#666', formatter: v => v > 0 ? `${v}m` : '' }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* App list with progress */}
                <div className="col-lg-5 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 pt-3 pb-0">
                      <h6 className="font-weight-bold m-0">All Apps Used</h6>
                    </div>
                    <div className="card-body p-0 overflow-auto" style={{ maxHeight: 370 }}>
                      <ul className="list-group list-group-flush">
                        {apps.map((app, i) => {
                          const mins = app.usageInfo?.displayMinutes ?? app.usageInfo?.dailyMinutes ?? 0;
                          const pct  = app.usageInfo?.percentage ?? 0;
                          const color = APP_COLORS[i % APP_COLORS.length];
                          const hm = mins >= 60 ? `${Math.floor(mins/60)}h ${mins%60}m` : `${mins}m`;
                          return (
                            <motion.li key={app._id || i}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                              className="list-group-item border-0 px-4 py-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="rounded d-flex align-items-center justify-content-center text-white font-weight-bold"
                                    style={{ width: 28, height: 28, background: color, fontSize: 12, flexShrink: 0 }}>
                                    {(app.appName || '?').charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-weight-bold" style={{ fontSize: 13 }}>{app.appName || 'Unknown'}</span>
                                </div>
                                <span className="text-muted font-weight-bold" style={{ fontSize: 12 }}>{hm}</span>
                              </div>
                              <div className="progress rounded-pill" style={{ height: 5, background: '#f0f2f5' }}>
                                <motion.div
                                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                                  className="progress-bar rounded-pill" style={{ background: color }} />
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
