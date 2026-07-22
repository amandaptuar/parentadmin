import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle, Users,
  Search, CheckCheck, MoreVertical
} from 'lucide-react';
import { getChildSocial } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString();
}

export const WhatsappMonitoring = () => {
  const { selectedChild } = useChild();
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const data = await getChildSocial(selectedChild._id, { app: 'WhatsApp' });
      const convs = data.apps?.[0]?.conversations || [];
      setConversations(convs);
      setSelectedChat(convs[0] || null);
    } catch (err) {
      console.error(err);
      setConversations([]);
      setSelectedChat(null);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = conversations.filter(c =>
    c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: '#25D366' }}>
                <MessageCircle className="text-white" size={20} />
              </div>
              WhatsApp Monitoring
            </h4>
            <ChildSelector />
          </div>
        </div>

        {!selectedChild ? (
          <div className="text-center text-muted py-5">Select a child to view WhatsApp activity.</div>
        ) : (
          <div className="row">

            {/* Left Sidebar (Conversations List) */}
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100" style={{ minHeight: '650px', background: '#f0f2f5' }}>

                <div className="card-header border-0 p-3" style={{ background: '#f0f2f5' }}>
                  <div className="position-relative">
                    <Search className="position-absolute text-muted" size={16} style={{ left: '12px', top: '10px' }} />
                    <input
                      type="text"
                      className="form-control pl-5 rounded shadow-sm border-0"
                      placeholder="Search or start new chat"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="card-body p-0 overflow-auto bg-white" style={{ maxHeight: '580px' }}>
                  {loading ? (
                    <div className="text-center text-muted py-5">
                      <div className="spinner-border spinner-border-sm me-2"></div> Loading...
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <MessageCircle size={32} className="mb-2 opacity-50" />
                      <p className="m-0">No WhatsApp activity captured yet.</p>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {filtered.map((conv, i) => (
                        <li
                          key={i}
                          onClick={() => setSelectedChat(conv)}
                          className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 ${selectedChat === conv ? 'bg-light' : ''}`}
                          style={{ cursor: 'pointer', borderBottom: '1px solid #f2f2f2' }}
                        >
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                            style={{ width: 48, height: 48, fontSize: 18 }}>
                            {conv.isGroup ? <Users size={20} /> : conv.contact.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex justify-content-between align-items-baseline mb-1">
                              <h6 className="m-0 text-truncate font-weight-bold" style={{ fontSize: '15px', color: '#111b21' }}>{conv.contact}</h6>
                              <small className="text-muted" style={{ fontSize: '12px' }}>{formatTime(conv.lastTime)}</small>
                            </div>
                            <p className="m-0 text-truncate text-muted" style={{ fontSize: '13px' }}>
                              {conv.messages[conv.messages.length - 1]?.text || ''}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Right Pane (Chat View) */}
            <div className="col-md-8 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100 d-flex flex-column overflow-hidden" style={{ minHeight: '650px', background: '#efeae2' }}>

                {selectedChat ? (
                  <>
                    <div className="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center" style={{ background: '#f0f2f5' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 40, height: 40, fontSize: 15 }}>
                          {selectedChat.isGroup ? <Users size={18} /> : selectedChat.contact.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="m-0 font-weight-bold" style={{ color: '#111b21' }}>{selectedChat.contact}</h6>
                          <small className="text-muted">{selectedChat.messages.length} captured message{selectedChat.messages.length !== 1 ? 's' : ''}</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-link text-muted"><MoreVertical size={20} /></button>
                    </div>

                    <div className="card-body overflow-auto flex-grow-1 p-4">
                      {selectedChat.messages.map((msg) => (
                        <div key={msg.id} className="d-flex mb-3 justify-content-start">
                          <div style={{ maxWidth: '65%' }}>
                            <div className="p-2 shadow-sm bg-white" style={{ borderRadius: '8px', borderTopLeftRadius: 0 }}>
                              <p className="m-0" style={{ fontSize: '14.5px', lineHeight: '19px' }}>{msg.text}</p>
                              <div className="d-flex justify-content-end align-items-center gap-1 mt-1">
                                <small className="text-muted" style={{ fontSize: '11px' }}>
                                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                                <CheckCheck size={14} className="text-muted" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="card-body d-flex align-items-center justify-content-center flex-column text-muted">
                    <MessageCircle size={48} className="mb-3 opacity-50" />
                    <h5>WhatsApp Monitoring</h5>
                    <p>Select a conversation to view captured messages.</p>
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
