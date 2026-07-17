import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Inbox, Send, Search, User, RefreshCw } from 'lucide-react';
import { getChildSms } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

export const SmsMonitoring = () => {
  const { selectedChild } = useChild();
  const [activeTab, setActiveTab]         = useState('inbox');
  const [searchTerm, setSearchTerm]       = useState('');
  const [threads, setThreads]             = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading]             = useState(false);

  const tabs = [
    { id: 'inbox', label: 'Inbox',  icon: Inbox },
    { id: 'sent',  label: 'Sent',   icon: Send  },
  ];

  const fetchSms = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const data = await getChildSms(selectedChild._id, { type: activeTab, search: searchTerm || undefined, limit: 200 });
      setThreads(data.threads || []);
      setSelectedThread(null);
    } catch (err) {
      console.error(err);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChild, activeTab, searchTerm]);

  useEffect(() => { fetchSms(); }, [fetchSms]);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MessageSquare className="text-primary" /> SMS Monitoring
            </h4>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <ChildSelector />
            <button className="btn btn-light btn-sm" onClick={fetchSms}><RefreshCw size={14} /></button>
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to view messages</h5>
          </div>
        ) : (
          <div className="row">
            {/* Left: thread list */}
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100" style={{ minHeight: '600px' }}>
                <div className="card-header bg-white border-0 pt-4 pb-2">
                  <div className="position-relative mb-3">
                    <Search className="position-absolute text-muted" size={16} style={{ left: '12px', top: '10px' }} />
                    <input type="text" className="form-control pl-5 rounded-pill shadow-sm"
                      placeholder="Search messages..." value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ background: '#f8f9fa', border: '1px solid #eee' }} />
                  </div>
                  <div className="d-flex gap-2 pb-2">
                    {tabs.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                          className={`btn rounded-pill px-3 py-1 d-flex align-items-center gap-1 border-0 ${activeTab === tab.id ? 'btn-primary shadow-sm' : 'bg-light text-muted'}`}
                          style={{ fontSize: '12px' }}>
                          <Icon size={14} /> {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="card-body p-0 overflow-auto" style={{ maxHeight: '500px' }}>
                  {loading ? (
                    <div className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading...
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="text-center py-4 text-muted">No messages found.</div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      <AnimatePresence>
                        {threads.map(thread => (
                          <motion.li key={thread.id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedThread(thread)}
                            className={`list-group-item list-group-item-action border-0 p-3 ${selectedThread?.id === thread.id ? 'bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="d-flex gap-3 align-items-center">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                  style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                                  <User size={20} />
                                </div>
                                <div>
                                  <h6 className="m-0 font-weight-bold" style={{ fontSize: '14px' }}>{thread.contact}</h6>
                                  <p className="m-0 text-muted text-truncate" style={{ maxWidth: '150px', fontSize: '13px' }}>
                                    {thread.lastPreview}
                                  </p>
                                </div>
                              </div>
                              <small className="text-muted">{formatTime(thread.lastTime)}</small>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right: messages */}
            <div className="col-md-8 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100 d-flex flex-column" style={{ minHeight: '600px' }}>
                {selectedThread ? (
                  <>
                    <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <h6 className="m-0 font-weight-bold">{selectedThread.contact}</h6>
                        <small className="text-muted">{selectedThread.messages.length} messages</small>
                      </div>
                    </div>
                    <div className="card-body overflow-auto flex-grow-1" style={{ background: '#f8f9fa' }}>
                      {[...selectedThread.messages].sort((a, b) => new Date(a.date) - new Date(b.date)).map(msg => {
                        const isMe = ['sent', 'outgoing'].includes(msg.kind || msg.type || '');
                        return (
                          <div key={msg._id} className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div style={{ maxWidth: '70%' }}>
                              <div className={`p-3 rounded shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                                style={{ borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
                                <p className="m-0">{msg.body}</p>
                              </div>
                              <small className={`d-block mt-1 text-muted ${isMe ? 'text-right' : ''}`}>
                                {formatTime(msg.date)}
                              </small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="card-body d-flex align-items-center justify-content-center flex-column text-muted">
                    <MessageSquare size={48} className="mb-3 opacity-50" />
                    <h5>Select a conversation</h5>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
