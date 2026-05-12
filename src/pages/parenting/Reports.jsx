import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, TrendingUp, 
  ShieldAlert, Activity, PieChart as PieChartIcon, HeartPulse
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const trendData = [
  { week: 'W1', usage: 35, risk: 10 },
  { week: 'W2', usage: 42, risk: 15 },
  { week: 'W3', usage: 38, risk: 8 },
  { week: 'W4', usage: 45, risk: 5 },
];

const categoryData = [
  { name: 'Education', value: 30, color: '#009688' },
  { name: 'Social', value: 45, color: '#3f51b5' },
  { name: 'Games', value: 15, color: '#ffb430' },
  { name: 'Other', value: 10, color: '#9e9e9e' },
];

const aiInsights = [
  { id: 1, type: 'positive', text: 'Screen time decreased by 15% compared to last month. Great progress!', icon: TrendingUp, color: 'text-success' },
  { id: 2, type: 'warning', text: 'Social media usage spikes mostly late at night (10 PM - 12 AM).', icon: Clock, color: 'text-warning' },
  { id: 3, type: 'danger', text: '2 flagged messages detected this week. Review recommended.', icon: ShieldAlert, color: 'text-danger' },
];

// Helper to mock the missing Clock icon from above
import { Clock } from 'lucide-react';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('weekly');

  const tabs = [
    { id: 'weekly', label: 'Weekly Reports', icon: Calendar },
    { id: 'monthly', label: 'Monthly Reports', icon: PieChartIcon },
    { id: 'risk', label: 'AI Risk Reports', icon: ShieldAlert },
    { id: 'trends', label: 'Device Trends', icon: TrendingUp },
  ];

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <FileText className="text-primary" /> Reports & Analytics
            </h4>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Report download will start shortly.')}
              className="btn btn-primary rounded-pill shadow-sm font-weight-bold d-flex align-items-center gap-2"
            >
              <Download size={16} /> Export PDF Report
            </motion.button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 shadow-sm ${isActive ? 'btn-primary' : 'bg-white text-muted'}`}
                    style={{ transition: 'all 0.3s', flexShrink: 0 }}
                  >
                    <Icon size={16} />
                    <span className="font-weight-bold" style={{ fontSize: '14px' }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Report Document Style Container */}
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow border-0" style={{ borderRadius: '16px', background: '#fcfcfc' }}>
              
              {/* Report Header */}
              <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-start" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <div>
                  <h3 className="font-weight-bold m-0" style={{ color: '#2d3b48' }}>Emma's Activity Report</h3>
                  <p className="text-muted m-0 mt-1">Generated: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <h5 className="font-weight-bold m-0 text-primary">Urora Guardian</h5>
                  <p className="text-muted m-0"><small>Premium Plan</small></p>
                </div>
              </div>

              <div className="card-body p-4">
                
                {/* Key Metrics */}
                <div className="row mb-5">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="p-3 bg-white rounded shadow-sm border border-light">
                      <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Avg Daily Screen Time</p>
                      <h3 className="m-0 font-weight-bold text-dark">4h 15m</h3>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="p-3 bg-white rounded shadow-sm border border-light">
                      <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Total Messages</p>
                      <h3 className="m-0 font-weight-bold text-dark">1,240</h3>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <div className="p-3 bg-white rounded shadow-sm border border-light">
                      <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>New Apps Installed</p>
                      <h3 className="m-0 font-weight-bold text-dark">3</h3>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-white rounded shadow-sm border border-danger border-left-0 border-right-0 border-top-0" style={{ borderBottomWidth: '3px' }}>
                      <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '11px' }}>Risk Assessment</p>
                      <h3 className="m-0 font-weight-bold text-success">Low Risk</h3>
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  {/* AI Insights Panel */}
                  <div className="col-lg-5 mb-4 mb-lg-0">
                    <h5 className="header-title mb-3 d-flex align-items-center gap-2"><Activity size={18} className="text-primary"/> AI Behavioral Insights</h5>
                    <div className="bg-white p-3 rounded shadow-sm border border-light h-100">
                      {aiInsights.map((insight, index) => {
                        const Icon = insight.icon;
                        return (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={insight.id} 
                            className="d-flex mb-3 border-bottom pb-3 last:border-0 last:pb-0"
                            style={{ borderBottom: index === aiInsights.length - 1 ? 'none' : '1px solid #f1f1f1' }}
                          >
                            <div className={`mr-3 mt-1 ${insight.color}`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="m-0 text-dark" style={{ fontSize: '14.5px', lineHeight: '1.5' }}>{insight.text}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Usage Breakdown Pie Chart */}
                  <div className="col-lg-7">
                    <h5 className="header-title mb-3 d-flex align-items-center gap-2"><PieChartIcon size={18} className="text-primary"/> Application Breakdown</h5>
                    <div className="bg-white p-3 rounded shadow-sm border border-light" style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                          <Legend verticalAlign="middle" align="right" layout="vertical" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Trend Graph */}
                <div className="row">
                  <div className="col-12">
                    <h5 className="header-title mb-3 d-flex align-items-center gap-2"><HeartPulse size={18} className="text-primary"/> Usage vs Risk Trend (Monthly)</h5>
                    <div className="bg-white p-4 rounded shadow-sm border border-light" style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4f4c" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ef4f4c" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                          <Area type="monotone" dataKey="usage" name="Total Usage (hrs)" stroke="#3f51b5" fillOpacity={1} fill="url(#colorUsage)" />
                          <Area type="monotone" dataKey="risk" name="Risk Alerts" stroke="#ef4f4c" fillOpacity={1} fill="url(#colorRisk)" />
                        </AreaChart>
                      </ResponsiveContainer>
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

      </div>
    </div>
  );
};
