import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, 
  Search, PlayCircle, Filter, Calendar
} from 'lucide-react';

const callsData = [
  { id: 1, type: 'incoming', contact: 'Mom', number: '+1 (555) 123-4567', time: '10:30 AM', duration: '15m 20s', date: 'Today', status: 'answered', avatar: 'https://i.pravatar.cc/150?u=mom' },
  { id: 2, type: 'missed', contact: 'Unknown', number: '+1 (555) 999-8888', time: '09:15 AM', duration: '0s', date: 'Today', status: 'missed', avatar: null },
  { id: 3, type: 'outgoing', contact: 'Alex (School)', number: '+1 (555) 333-2222', time: '08:45 AM', duration: '2m 10s', date: 'Today', status: 'answered', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 4, type: 'incoming', contact: 'Dad', number: '+1 (555) 111-0000', time: 'Yesterday', duration: '45m 00s', date: 'Yesterday', status: 'answered', avatar: 'https://i.pravatar.cc/150?u=dad', recorded: true },
  { id: 5, type: 'outgoing', contact: 'Pizza Hut', number: '+1 (555) 777-6666', time: 'Yesterday', duration: '1m 45s', date: 'Yesterday', status: 'answered', avatar: null },
];

export const CallsMonitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['incoming', 'outgoing', 'missed', 'recorded'].includes(path)) {
      setActiveTab(path);
    } else {
      setActiveTab('all');
    }
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      navigate('/dashboard/calls');
    } else {
      navigate(`/dashboard/calls/${tabId}`);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalls = callsData.filter(call => {
    const matchesTab = activeTab === 'all' || call.type === activeTab || (activeTab === 'recorded' && call.recorded);
    const matchesSearch = call.contact.toLowerCase().includes(searchTerm.toLowerCase()) || call.number.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'All Calls', icon: PhoneCall },
    { id: 'incoming', label: 'Incoming', icon: PhoneIncoming },
    { id: 'outgoing', label: 'Outgoing', icon: PhoneOutgoing },
    { id: 'missed', label: 'Missed', icon: PhoneMissed },
    { id: 'recorded', label: 'Recorded', icon: PlayCircle },
  ];

  const getCallIcon = (type) => {
    switch(type) {
      case 'incoming': return <PhoneIncoming size={16} className="text-success" />;
      case 'outgoing': return <PhoneOutgoing size={16} className="text-primary" />;
      case 'missed': return <PhoneMissed size={16} className="text-danger" />;
      default: return <PhoneCall size={16} />;
    }
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <PhoneCall className="text-primary" /> Calls Monitoring
            </h4>
            
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <Search className="position-absolute text-muted" size={18} style={{ left: '12px', top: '10px' }} />
                <input 
                  type="text" 
                  className="form-control pl-5 rounded-pill border-0 shadow-sm" 
                  placeholder="Search contacts or numbers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '250px' }}
                />
              </div>
              <button className="btn btn-light shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                <Filter size={18} className="text-dark" />
              </button>
              <button className="btn btn-light shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                <Calendar size={18} className="text-dark" />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="row mb-4">
          <div className="col-md-3">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg bg-primary text-white">
              <div className="card-body">
                <p className="text-white-50 mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Total Calls (This Week)</p>
                <h3 className="m-0 font-weight-bold text-white">42</h3>
              </div>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Total Duration</p>
                <h3 className="m-0 font-weight-bold">4h 15m</h3>
              </div>
            </motion.div>
          </div>
          <div className="col-md-3">
            <motion.div whileHover={{ y: -5 }} className="card shadow-sm border-0 rounded-lg">
              <div className="card-body">
                <p className="text-muted mb-1 text-uppercase font-weight-bold" style={{ fontSize: '12px' }}>Most Dialed</p>
                <h3 className="m-0 font-weight-bold">Mom</h3>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-2 bg-white p-2 rounded-pill shadow-sm" style={{ width: 'max-content' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 ${isActive ? 'btn-primary shadow-sm' : 'btn-light text-muted bg-transparent'}`}
                    style={{ transition: 'all 0.3s' }}
                  >
                    <Icon size={16} />
                    <span className="font-weight-bold" style={{ fontSize: '14px' }}>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call History Table */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 font-weight-bold text-muted">Type</th>
                      <th className="border-0 font-weight-bold text-muted">Contact</th>
                      <th className="border-0 font-weight-bold text-muted">Number</th>
                      <th className="border-0 font-weight-bold text-muted">Date & Time</th>
                      <th className="border-0 font-weight-bold text-muted">Duration</th>
                      <th className="border-0 font-weight-bold text-muted text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredCalls.length > 0 ? filteredCalls.map((call, index) => (
                        <motion.tr 
                          key={call.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td style={{ verticalAlign: 'middle' }}>
                            <div className={`rounded-circle d-flex align-items-center justify-content-center bg-light`} style={{ width: '36px', height: '36px' }}>
                              {getCallIcon(call.type)}
                            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div className="d-flex align-items-center gap-3">
                              {call.avatar ? (
                                <img src={call.avatar} className="rounded-circle shadow-sm" width="36" height="36" alt={call.contact} />
                              ) : (
                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center font-weight-bold shadow-sm" style={{ width: '36px', height: '36px' }}>
                                  {call.contact.charAt(0)}
                                </div>
                              )}
                              <span className="font-weight-bold text-dark">{call.contact}</span>
                            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle' }} className="text-muted">{call.number}</td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <span className="d-block text-dark">{call.date}</span>
                            <small className="text-muted">{call.time}</small>
                          </td>
                          <td style={{ verticalAlign: 'middle' }} className="font-weight-bold text-dark">
                            {call.duration}
                          </td>
                          <td style={{ verticalAlign: 'middle' }} className="text-right">
                            {call.recorded ? (
                              <button onClick={() => alert('Playing call recording...')} className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1 float-right">
                                <PlayCircle size={14} /> Listen
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-light rounded-pill float-right text-muted" disabled>
                                Not Recorded
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="text-muted">
                              <PhoneCall size={48} className="mb-3 opacity-50" />
                              <h5>No calls found</h5>
                              <p>We couldn't find any call records matching your filter.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
