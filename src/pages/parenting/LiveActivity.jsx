import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, PhoneCall, MessageSquare, MapPin, AlertTriangle, 
  Wifi, Battery, Smartphone, Clock, Image as ImageIcon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const activityData = [
  { time: '10am', calls: 2, msgs: 15, apps: 30 },
  { time: '11am', calls: 0, msgs: 42, apps: 45 },
  { time: '12pm', calls: 1, msgs: 20, apps: 10 },
  { time: '1pm', calls: 4, msgs: 65, apps: 55 },
  { time: '2pm', calls: 0, msgs: 30, apps: 20 },
  { time: '3pm', calls: 2, msgs: 12, apps: 40 },
];

const timelineEvents = [
  { id: 1, type: 'location', title: 'Location Updated', desc: 'Arrived at Central High School', time: 'Just now', icon: MapPin, color: 'text-blue-500' },
  { id: 2, type: 'message', title: 'WhatsApp Message', desc: 'Received media from "Alex"', time: '5 mins ago', icon: MessageSquare, color: 'text-green-500' },
  { id: 3, type: 'call', title: 'Outgoing Call', desc: 'Dialed "Mom" (02:15)', time: '1 hour ago', icon: PhoneCall, color: 'text-indigo-500' },
  { id: 4, type: 'alert', title: 'Risk Alert', desc: 'Keyword "hate" detected in SMS', time: '2 hours ago', icon: AlertTriangle, color: 'text-red-500' },
  { id: 5, type: 'media', title: 'New Photo Saved', desc: 'Screenshot taken in Instagram', time: '3 hours ago', icon: ImageIcon, color: 'text-purple-500' },
];

export const LiveActivity = () => {
  const [isLive, setIsLive] = useState(true);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
      setTimeout(() => setIsLive(true), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <Activity className="text-primary" /> Live Activity Overview
            </h4>
            <div className="d-flex align-items-center gap-3 bg-white px-3 py-2 rounded shadow-sm">
              <div className="d-flex align-items-center gap-2">
                <Smartphone size={18} className="text-secondary" />
                <span className="font-weight-bold">Emma's iPhone 13</span>
              </div>
              <div className="border-left pl-3 d-flex align-items-center gap-2">
                <Battery size={18} className="text-success" />
                <span>84%</span>
              </div>
              <div className="border-left pl-3 d-flex align-items-center gap-2">
                <Wifi size={18} className="text-primary" />
                <span className="d-flex align-items-center gap-1">
                  Online
                  <motion.div 
                    animate={{ scale: isLive ? [1, 1.5, 1] : 1, opacity: isLive ? [1, 0.5, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="rounded-circle bg-success"
                    style={{ width: '8px', height: '8px' }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="row">
          <div className="col-md-3 mb-4">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Total Calls Today</p>
                    <h3 className="m-0 font-weight-bold">14</h3>
                  </div>
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(63, 81, 181, 0.1)' }}>
                    <PhoneCall className="text-primary" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="col-md-3 mb-4">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Messages</p>
                    <h3 className="m-0 font-weight-bold">184</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(0, 150, 136, 0.1)' }}>
                    <MessageSquare className="text-success" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-md-3 mb-4">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>App Usage</p>
                    <h3 className="m-0 font-weight-bold">4h 20m</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(255, 180, 48, 0.1)' }}>
                    <Clock className="text-warning" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-md-3 mb-4">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Risk Score</p>
                    <h3 className="m-0 font-weight-bold text-danger">Low</h3>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', background: 'rgba(239, 79, 76, 0.1)' }}>
                    <AlertTriangle className="text-danger" size={24} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="row">
          {/* Activity Graph */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100">
              <div className="card-body">
                <h5 className="header-title mb-4">Activity Volume Trends</h5>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="monotone" dataKey="msgs" name="Messages" stroke="#009688" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                      <Line type="monotone" dataKey="apps" name="App Usage" stroke="#ffb430" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Live Timeline Feed */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="header-title m-0">Live Timeline</h5>
                  <span className="badge badge-soft-primary px-2 py-1">Syncing...</span>
                </div>
                
                <div className="timeline">
                  {timelineEvents.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={event.id} 
                        className="d-flex mb-4"
                      >
                        <div className="mr-3 mt-1">
                          <div className={`rounded-circle p-2 shadow-sm ${event.color.replace('text-', 'bg-light-')}`} style={{ background: '#f8f9fa' }}>
                            <Icon size={16} className={event.color} />
                          </div>
                        </div>
                        <div className="flex-grow-1 border-bottom pb-3">
                          <div className="d-flex justify-content-between">
                            <h6 className="m-0 font-weight-bold">{event.title}</h6>
                            <small className="text-muted">{event.time}</small>
                          </div>
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '13px' }}>{event.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
