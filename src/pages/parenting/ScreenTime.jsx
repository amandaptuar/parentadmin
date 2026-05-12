import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Shield, Moon, MonitorSmartphone, 
  Settings, Zap, CheckCircle2, XCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const usageData = [
  { day: 'Mon', usage: 4.5 },
  { day: 'Tue', usage: 3.2 },
  { day: 'Wed', usage: 5.0 },
  { day: 'Thu', usage: 2.8 },
  { day: 'Fri', usage: 4.1 },
  { day: 'Sat', usage: 6.5 },
  { day: 'Sun', usage: 5.8 },
];

const appUsage = [
  { id: 1, name: 'TikTok', time: '2h 15m', percentage: 45, color: '#000000', blocked: false },
  { id: 2, name: 'Instagram', time: '1h 30m', percentage: 30, color: '#E1306C', blocked: true },
  { id: 3, name: 'YouTube', time: '45m', percentage: 15, color: '#FF0000', blocked: false },
  { id: 4, name: 'Snapchat', time: '30m', percentage: 10, color: '#FFFC00', blocked: false },
];

export const ScreenTime = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'App Usage Analytics', icon: Clock },
    { id: 'focus', label: 'Focus Mode', icon: Zap },
    { id: 'sleep', label: 'Sleep Mode', icon: Moon },
    { id: 'blocking', label: 'Remote App Blocking', icon: Shield },
  ];

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MonitorSmartphone className="text-primary" /> Screen Time Controls
            </h4>
            
            <button onClick={() => alert('Device has been securely locked.')} className="btn btn-warning rounded-pill shadow-sm font-weight-bold d-flex align-items-center gap-2">
              <Shield size={16} /> Lock Device Now
            </button>
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

        <div className="row">
          
          {/* Main Analytics Area */}
          <div className="col-lg-8 mb-4">
            
            {/* Today's Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card shadow-sm border-0 rounded-lg h-100 bg-primary text-white">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <p className="text-white-50 mb-1 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Total Screen Time Today</p>
                    <h2 className="m-0 font-weight-bold">5h 00m</h2>
                    <p className="text-white-50 m-0 mt-2"><small>+1h 20m from yesterday</small></p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card shadow-sm border-0 rounded-lg h-100">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <p className="text-muted mb-1 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Pickups Today</p>
                    <h2 className="m-0 font-weight-bold text-dark">45</h2>
                    <p className="text-success m-0 mt-2"><small>-12% from average</small></p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm border-0 rounded-lg h-100">
                  <div className="card-body text-center d-flex flex-column justify-content-center">
                    <p className="text-muted mb-1 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Productivity Score</p>
                    <h2 className="m-0 font-weight-bold text-dark">32%</h2>
                    <p className="text-danger m-0 mt-2"><small>Mostly entertainment</small></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="m-0 font-weight-bold">Weekly Usage Trends</h6>
                  <select className="form-control form-control-sm w-auto rounded-pill bg-light border-0">
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                      <Tooltip 
                        cursor={{fill: 'rgba(63, 81, 181, 0.1)'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="usage" name="Hours" fill="#3f51b5" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Right Panel (App Limits & Controls) */}
          <div className="col-lg-4 mb-4">
            
            {/* App Usage List */}
            <div className="card shadow-sm border-0 rounded-lg mb-4">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold">Most Used Apps</h6>
                <button className="btn btn-sm btn-link text-primary p-0">See All</button>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {appUsage.map(app => (
                    <li key={app.id} className="list-group-item p-3 border-0" style={{ borderBottom: '1px solid #f8f9fa !important' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded shadow-sm d-flex justify-content-center align-items-center text-white font-weight-bold" style={{ width: '30px', height: '30px', background: app.color, fontSize: '12px' }}>
                            {app.name.charAt(0)}
                          </div>
                          <span className="font-weight-bold text-dark">{app.name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-muted font-weight-bold">{app.time}</span>
                          <div className="custom-control custom-switch">
                            <input type="checkbox" className="custom-control-input" id={`block${app.id}`} defaultChecked={!app.blocked} />
                            <label className="custom-control-label" htmlFor={`block${app.id}`}></label>
                          </div>
                        </div>
                      </div>
                      <div className="progress rounded-pill mt-2" style={{ height: '6px', background: '#f0f2f5' }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${app.percentage}%` }}
                          transition={{ duration: 1 }}
                          className="progress-bar rounded-pill" 
                          role="progressbar" 
                          style={{ background: app.color }}
                        ></motion.div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Schedules */}
            <div className="card shadow-sm border-0 rounded-lg">
              <div className="card-body p-0">
                
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <h6 className="m-0 font-weight-bold">Focus Mode</h6>
                      <small className="text-muted">During School: 08:00 AM - 03:00 PM</small>
                    </div>
                  </div>
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="focusSwitch" defaultChecked />
                    <label className="custom-control-label" htmlFor="focusSwitch"></label>
                  </div>
                </div>

                <div className="p-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      <Moon size={20} />
                    </div>
                    <div>
                      <h6 className="m-0 font-weight-bold">Sleep Schedule</h6>
                      <small className="text-muted">Bedtime: 10:00 PM - 07:00 AM</small>
                    </div>
                  </div>
                  <div className="custom-control custom-switch">
                    <input type="checkbox" className="custom-control-input" id="sleepSwitch" defaultChecked />
                    <label className="custom-control-label" htmlFor="sleepSwitch"></label>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
