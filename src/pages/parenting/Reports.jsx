import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Calendar, TrendingUp,
  ShieldAlert, Activity, PieChart as PieChartIcon, HeartPulse, CheckCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getChildAppsSummary, getChildSms, listAiDaily, getAiDaily } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

const APP_COLORS = ['#3f51b5', '#e91e63', '#009688', '#ff9800', '#9c27b0', '#00bcd4'];

function formatMinutes(mins) {
  const h = Math.floor(mins / 60), m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const Reports = () => {
  const { selectedChild } = useChild();
  const [loading, setLoading] = useState(false);
  const [appsSummary, setAppsSummary] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [aiInsight, setAiInsight] = useState(null); // most recent AI daily_intelligence, or null

  const fetchReport = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const [apps, sms, aiList] = await Promise.allSettled([
        getChildAppsSummary(selectedChild._id, { days: 7 }),
        getChildSms(selectedChild._id, { limit: 1 }),
        listAiDaily(selectedChild._id),
      ]);

      if (apps.status === 'fulfilled') setAppsSummary(apps.value);
      if (sms.status === 'fulfilled') setMessageCount(sms.value?.total || 0);

      // Pull the most recent day that actually has an AI analysis.
      if (aiList.status === 'fulfilled') {
        const days = aiList.value?.days || aiList.value?.dates || [];
        const latestDate = Array.isArray(days) && days.length > 0 ? days[days.length - 1] : null;
        if (latestDate) {
          const detail = await getAiDaily(selectedChild._id, latestDate.date || latestDate).catch(() => null);
          setAiInsight(detail?.daily_intelligence || detail || null);
        } else {
          setAiInsight(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const dailyBreakdown = appsSummary?.dailyBreakdown || [];
  const topApps = appsSummary?.topApps || [];
  const avgPerDay = appsSummary?.avgPerDayMinutes || 0;

  const trendData = dailyBreakdown.map(d => ({
    day: new Date(d.day).toLocaleDateString(undefined, { weekday: 'short' }),
    minutes: d.totalMinutes,
  }));

  const pieData = topApps.map((a, i) => ({ name: a.appName || a.packageName, value: a.totalMinutes, color: APP_COLORS[i % APP_COLORS.length] }));

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <FileText className="text-primary" /> Reports & Analytics
            </h4>
            <ChildSelector />
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <FileText size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to view their report</h5>
          </div>
        ) : loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border spinner-border-sm me-2"></div> Loading report...
          </div>
        ) : (
          <div className="row">
            <div className="col-12 mb-4">
              <div className="card shadow border-0" style={{ borderRadius: '16px', background: '#fcfcfc' }}>

                <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-start" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                  <div>
                    <h3 className="font-weight-bold m-0" style={{ color: '#2d3b48' }}>{selectedChild.name}'s Activity Report</h3>
                    <p className="text-muted m-0 mt-1">Last 7 days · Generated {new Date().toLocaleDateString()}</p>
                  </div>
                  {aiInsight && (
                    <div className="text-right">
                      <h5 className={`font-weight-bold m-0 text-${aiInsight.wellness_band === 'good' ? 'success' : aiInsight.wellness_band === 'concerning' ? 'danger' : 'warning'}`}>
                        {aiInsight.wellness_score ?? '—'}/100
                      </h5>
                      <p className="text-muted m-0"><small>Wellness Score</small></p>
                    </div>
                  )}
                </div>

                <div className="card-body p-4">

                  {/* Key Metrics — all real */}
                  <div className="row mb-5">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="p-3 bg-white rounded shadow-sm border border-light">
                        <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Avg Daily Screen Time</p>
                        <h3 className="m-0 font-weight-bold text-dark">{formatMinutes(avgPerDay)}</h3>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="p-3 bg-white rounded shadow-sm border border-light">
                        <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Total Messages</p>
                        <h3 className="m-0 font-weight-bold text-dark">{messageCount}</h3>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-white rounded shadow-sm border border-light">
                        <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Wellness Band</p>
                        <h3 className={`m-0 font-weight-bold text-${aiInsight ? (aiInsight.wellness_band === 'good' ? 'success' : 'warning') : 'muted'}`}>
                          {aiInsight ? aiInsight.wellness_band : 'No AI report yet'}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    {/* AI Insights Panel — real, from the AI Behaviour Analysis engine */}
                    <div className="col-lg-5 mb-4 mb-lg-0">
                      <h5 className="header-title mb-3 d-flex align-items-center gap-2"><Activity size={18} className="text-primary" /> AI Behavioral Insights</h5>
                      <div className="bg-white p-3 rounded shadow-sm border border-light h-100">
                        {!aiInsight ? (
                          <div className="text-center text-muted py-4">
                            <ShieldAlert size={28} className="mb-2 opacity-50" />
                            <p className="m-0" style={{ fontSize: 14 }}>No AI analysis available yet. It's generated automatically once the child's device has sent SMS/call activity.</p>
                          </div>
                        ) : (
                          <>
                            <p className="mb-3" style={{ fontSize: 14 }}>{aiInsight.executive_summary}</p>
                            {(aiInsight.concerning_findings || []).slice(0, 3).map((f, i) => (
                              <div key={i} className="d-flex mb-3 border-bottom pb-3" style={{ borderBottom: '1px solid #f1f1f1' }}>
                                <div className="mr-3 mt-1 text-danger"><ShieldAlert size={18} /></div>
                                <p className="m-0 text-dark" style={{ fontSize: '14px' }}>{f.statement || f.display_label}</p>
                              </div>
                            ))}
                            {(aiInsight.recommendations || []).slice(0, 2).map((r, i) => (
                              <div key={i} className="d-flex mb-2">
                                <div className="mr-3 mt-1 text-success"><CheckCircle size={18} /></div>
                                <p className="m-0 text-dark" style={{ fontSize: '14px' }}>{r.statement || r.display_label}</p>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Top Apps Breakdown — real usage data */}
                    <div className="col-lg-7">
                      <h5 className="header-title mb-3 d-flex align-items-center gap-2"><PieChartIcon size={18} className="text-primary" /> Top Apps (Last 7 Days)</h5>
                      <div className="bg-white p-3 rounded shadow-sm border border-light" style={{ height: '250px' }}>
                        {pieData.length === 0 ? (
                          <div className="d-flex align-items-center justify-content-center h-100 text-muted">No app usage data yet.</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                              </Pie>
                              <Tooltip formatter={(v, n) => [`${v} min`, n]} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Real 7-day screen time trend */}
                  <div className="row">
                    <div className="col-12">
                      <h5 className="header-title mb-3 d-flex align-items-center gap-2"><HeartPulse size={18} className="text-primary" /> Screen Time Trend (7 Days)</h5>
                      <div className="bg-white p-4 rounded shadow-sm border border-light" style={{ height: '300px' }}>
                        {trendData.length === 0 ? (
                          <div className="d-flex align-items-center justify-content-center h-100 text-muted">No usage recorded in the last 7 days.</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#3f51b5" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#999' }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999' }} />
                              <Tooltip formatter={(v) => [`${v} min`, 'Screen Time']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Area type="monotone" dataKey="minutes" name="Screen Time (min)" stroke="#3f51b5" fillOpacity={1} fill="url(#colorUsage)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="card-footer bg-light border-top p-3 text-center text-muted" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', fontSize: '12px' }}>
                  End of Report. Confidential data intended for parental review only.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
