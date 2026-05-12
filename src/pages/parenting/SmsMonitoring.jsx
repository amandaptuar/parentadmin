import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Inbox, Send, AlertTriangle, 
  Search, ShieldAlert, ChevronRight, User
} from 'lucide-react';

const conversations = [
  { id: 1, contact: 'Alex (School)', preview: 'Are you going to the party tonight?', time: '10:30 AM', unread: 2, flagged: false, type: 'inbox' },
  { id: 2, contact: 'Unknown (+1 555-0000)', preview: 'I hate you so much.', time: '09:15 AM', unread: 1, flagged: true, type: 'inbox' },
  { id: 3, contact: 'Mom', preview: 'Ok, see you later.', time: 'Yesterday', unread: 0, flagged: false, type: 'sent' },
];

const selectedChatMessages = [
  { id: 1, sender: 'Unknown (+1 555-0000)', text: 'Where are you?', time: '09:10 AM', isMe: false, flagged: false },
  { id: 2, sender: 'Emma', text: 'I am not telling you.', time: '09:12 AM', isMe: true, flagged: false },
  { id: 3, sender: 'Unknown (+1 555-0000)', text: 'I hate you so much.', time: '09:15 AM', isMe: false, flagged: true, riskyWord: 'hate' },
];

export const SmsMonitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inbox');

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['inbox', 'sent', 'alerts'].includes(path)) {
      setActiveTab(path);
    } else {
      setActiveTab('inbox');
    }
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'inbox') {
      navigate('/dashboard/sms');
    } else {
      navigate(`/dashboard/sms/${tabId}`);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(conversations[1]); // Default to the flagged one

  const tabs = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'alerts', label: 'AI Alerts', icon: AlertTriangle },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesTab = activeTab === 'alerts' ? conv.flagged : conv.type === activeTab;
    const matchesSearch = conv.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MessageSquare className="text-primary" /> SMS Monitoring
            </h4>
          </div>
        </div>

        {/* AI Alerts Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="row mb-4"
        >
          <div className="col-12">
            <div className="card shadow-sm border-danger" style={{ borderLeft: '4px solid #ef4f4c' }}>
              <div className="card-body d-flex align-items-center justify-content-between py-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h6 className="m-0 font-weight-bold text-danger">AI Risk Detected</h6>
                    <p className="text-muted m-0" style={{ fontSize: '13px' }}>1 new flagged message containing abusive language.</p>
                  </div>
                </div>
                <button 
                  className="btn btn-outline-danger btn-sm rounded-pill font-weight-bold"
                  onClick={() => handleTabChange('alerts')}
                >
                  Review Alerts
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Layout */}
        <div className="row">
          
          {/* Left Sidebar (Conversations List) */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100" style={{ minHeight: '600px' }}>
              
              <div className="card-header bg-white border-0 pt-4 pb-2">
                <div className="position-relative mb-3">
                  <Search className="position-absolute text-muted" size={16} style={{ left: '12px', top: '10px' }} />
                  <input 
                    type="text" 
                    className="form-control pl-5 rounded-pill shadow-sm" 
                    placeholder="Search messages..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: '#f8f9fa', border: '1px solid #eee' }}
                  />
                </div>
                
                <div className="d-flex gap-2 pb-2 overflow-auto" style={{ scrollbarWidth: 'none' }}>
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`btn rounded-pill px-3 py-1 d-flex align-items-center gap-1 border-0 ${isActive ? 'btn-primary shadow-sm' : 'bg-light text-muted'}`}
                        style={{ fontSize: '12px', transition: 'all 0.2s', flexShrink: 0 }}
                      >
                        <Icon size={14} /> {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card-body p-0 overflow-auto" style={{ maxHeight: '500px' }}>
                <ul className="list-group list-group-flush">
                  <AnimatePresence>
                    {filteredConversations.map(conv => (
                      <motion.li 
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedChat(conv)}
                        className={`list-group-item list-group-item-action border-0 p-3 ${selectedChat?.id === conv.id ? 'bg-light' : ''}`}
                        style={{ cursor: 'pointer', borderBottom: '1px solid #f1f1f1 !important' }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex gap-3 align-items-center">
                            <div className="position-relative">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '40px', height: '40px' }}>
                                <User size={20} />
                              </div>
                              {conv.flagged && (
                                <span className="position-absolute border border-white rounded-circle bg-danger" style={{ width: '12px', height: '12px', bottom: 0, right: 0 }}></span>
                              )}
                            </div>
                            <div>
                              <h6 className={`m-0 ${conv.unread ? 'font-weight-bold' : ''}`} style={{ fontSize: '14px' }}>{conv.contact}</h6>
                              <p className={`m-0 text-truncate ${conv.flagged ? 'text-danger font-weight-bold' : 'text-muted'}`} style={{ maxWidth: '150px', fontSize: '13px' }}>
                                {conv.preview}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <small className="text-muted d-block">{conv.time}</small>
                            {conv.unread > 0 && (
                              <span className="badge badge-primary rounded-pill mt-1">{conv.unread}</span>
                            )}
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Pane (Chat View) */}
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100 d-flex flex-column" style={{ minHeight: '600px' }}>
              
              {selectedChat ? (
                <>
                  <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '40px', height: '40px' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <h6 className="m-0 font-weight-bold">{selectedChat.contact}</h6>
                        <small className="text-muted">SMS Conversation</small>
                      </div>
                    </div>
                    {selectedChat.flagged && (
                      <span className="badge badge-soft-danger px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                        <ShieldAlert size={14} /> High Risk Detected
                      </span>
                    )}
                  </div>
                  
                  <div className="card-body overflow-auto flex-grow-1" style={{ background: '#f8f9fa' }}>
                    {selectedChatMessages.map((msg, index) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`d-flex mb-4 ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div style={{ maxWidth: '70%' }}>
                          <div className={`p-3 rounded shadow-sm ${msg.isMe ? 'bg-primary text-white' : 'bg-white text-dark'} ${msg.flagged ? 'border border-danger' : ''}`} style={{ borderBottomRightRadius: msg.isMe ? '0' : '8px', borderBottomLeftRadius: msg.isMe ? '8px' : '0' }}>
                            {msg.flagged ? (
                              <p className="m-0">
                                {msg.text.split(new RegExp(`(${msg.riskyWord})`, 'gi')).map((part, i) => 
                                  part.toLowerCase() === msg.riskyWord.toLowerCase() ? (
                                    <span key={i} className="bg-danger text-white px-1 rounded font-weight-bold">{part}</span>
                                  ) : (
                                    <span key={i}>{part}</span>
                                  )
                                )}
                              </p>
                            ) : (
                              <p className="m-0">{msg.text}</p>
                            )}
                          </div>
                          <small className={`d-block mt-1 ${msg.isMe ? 'text-right' : 'text-left'} text-muted`}>{msg.time}</small>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="card-body d-flex align-items-center justify-content-center flex-column text-muted">
                  <MessageSquare size={48} className="mb-3 opacity-50" />
                  <h5>Select a conversation</h5>
                  <p>Choose a chat from the left to view messages.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
