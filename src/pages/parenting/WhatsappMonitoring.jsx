import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Image as ImageIcon, Mic, Users, 
  Search, Check, CheckCheck, PlayCircle, MoreVertical
} from 'lucide-react';

const conversations = [
  { id: 1, contact: 'Besties Squad', preview: 'Haha that is so funny!', time: '10:30 AM', unread: 5, isGroup: true, avatar: 'https://i.pravatar.cc/150?u=group1', online: false },
  { id: 2, contact: 'Noah', preview: 'Voice message (0:15)', time: '09:15 AM', unread: 0, isGroup: false, avatar: 'https://i.pravatar.cc/150?u=noah', online: true },
  { id: 3, contact: 'Mom', preview: 'Don\'t forget your jacket', time: 'Yesterday', unread: 0, isGroup: false, avatar: 'https://i.pravatar.cc/150?u=mom', online: false },
];

const selectedChatMessages = [
  { id: 1, sender: 'Noah', text: 'Hey, are we still hanging out later?', time: '09:10 AM', isMe: false, type: 'text', readStatus: 'read' },
  { id: 2, sender: 'Emma', text: 'Yes! Just finishing up homework.', time: '09:12 AM', isMe: true, type: 'text', readStatus: 'read' },
  { id: 3, sender: 'Noah', text: '', time: '09:14 AM', isMe: false, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300', readStatus: 'read' },
  { id: 4, sender: 'Noah', text: 'Voice message', time: '09:15 AM', isMe: false, type: 'audio', duration: '0:15', readStatus: 'delivered' },
];

export const WhatsappMonitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (['chats', 'media', 'voice', 'groups'].includes(path)) {
      setActiveTab(path);
    } else {
      setActiveTab('chats');
    }
  }, [location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'chats') {
      navigate('/dashboard/whatsapp');
    } else {
      navigate(`/dashboard/whatsapp/${tabId}`);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(conversations[1]);

  const tabs = [
    { id: 'chats', label: 'Chat Activity', icon: MessageCircle },
    { id: 'media', label: 'Media Sharing', icon: ImageIcon },
    { id: 'voice', label: 'Voice Notes', icon: Mic },
    { id: 'groups', label: 'Group Activity', icon: Users },
  ];

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
          </div>
        </div>

        {/* WhatsApp Layout */}
        <div className="row">
          
          {/* Left Sidebar (Conversations List) */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100" style={{ minHeight: '650px', background: '#f0f2f5' }}>
              
              <div className="card-header border-0 p-3 d-flex flex-column gap-3" style={{ background: '#f0f2f5' }}>
                <div className="d-flex gap-2 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`btn rounded-pill px-3 py-1 d-flex align-items-center gap-1 border-0 ${isActive ? 'shadow-sm text-white' : 'bg-white text-muted shadow-sm'}`}
                        style={{ fontSize: '12px', transition: 'all 0.2s', flexShrink: 0, background: isActive ? '#00a884' : 'white' }}
                      >
                        <Icon size={14} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

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

              <div className="card-body p-0 overflow-auto bg-white" style={{ maxHeight: '550px' }}>
                <ul className="list-group list-group-flush">
                  <AnimatePresence>
                    {conversations.map(conv => (
                      <motion.li 
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedChat(conv)}
                        className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 ${selectedChat?.id === conv.id ? 'bg-light' : ''}`}
                        style={{ cursor: 'pointer', borderBottom: '1px solid #f2f2f2 !important' }}
                      >
                        <div className="position-relative">
                          <img src={conv.avatar} alt={conv.contact} className="rounded-circle" width="48" height="48" />
                          {conv.online && (
                            <span className="position-absolute border border-white rounded-circle bg-success" style={{ width: '12px', height: '12px', bottom: 2, right: 0 }}></span>
                          )}
                        </div>
                        <div className="flex-grow-1 min-w-0">
                          <div className="d-flex justify-content-between align-items-baseline mb-1">
                            <h6 className="m-0 text-truncate font-weight-bold" style={{ fontSize: '15px', color: '#111b21' }}>{conv.contact}</h6>
                            <small className="text-muted" style={{ fontSize: '12px' }}>{conv.time}</small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <p className="m-0 text-truncate text-muted" style={{ fontSize: '13px' }}>
                              {conv.isGroup && !conv.preview.startsWith('Voice') ? <span className="font-weight-bold">Alex: </span> : null}
                              {conv.preview.startsWith('Voice') ? <><Mic size={14} className="mr-1 text-info" /> {conv.preview}</> : conv.preview}
                            </p>
                            {conv.unread > 0 && (
                              <span className="badge rounded-pill text-white" style={{ background: '#25D366' }}>{conv.unread}</span>
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

          {/* Right Pane (WhatsApp Chat View) */}
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm border-0 rounded-lg h-100 d-flex flex-column overflow-hidden" style={{ minHeight: '650px', background: '#efeae2' }}>
              
              {/* WhatsApp Background Pattern (Simulated with simple CSS) */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06, backgroundImage: 'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")', zIndex: 0, pointerEvents: 'none' }}></div>
              
              {selectedChat ? (
                <>
                  <div className="card-header border-0 py-2 px-3 d-flex justify-content-between align-items-center" style={{ background: '#f0f2f5', zIndex: 1 }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src={selectedChat.avatar} alt={selectedChat.contact} className="rounded-circle" width="40" height="40" />
                      <div>
                        <h6 className="m-0 font-weight-bold" style={{ color: '#111b21' }}>{selectedChat.contact}</h6>
                        <small className="text-muted">{selectedChat.online ? 'online' : 'last seen today at 10:30 AM'}</small>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => alert('Search messages...')} className="btn btn-sm btn-link text-muted"><Search size={20} /></button>
                      <button onClick={() => alert('Opening chat options...')} className="btn btn-sm btn-link text-muted"><MoreVertical size={20} /></button>
                    </div>
                  </div>
                  
                  <div className="card-body overflow-auto flex-grow-1 p-4" style={{ zIndex: 1 }}>
                    {selectedChatMessages.map((msg, index) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`d-flex mb-3 ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div className="position-relative" style={{ maxWidth: '65%' }}>
                          {!msg.isMe && selectedChat.isGroup && index === 0 && (
                            <small className="d-block font-weight-bold mb-1" style={{ color: '#00a884' }}>{msg.sender}</small>
                          )}
                          
                          <div className={`p-2 shadow-sm ${msg.isMe ? 'text-dark' : 'bg-white text-dark'}`} style={{ background: msg.isMe ? '#d9fdd3' : '#ffffff', borderRadius: '8px', borderTopRightRadius: msg.isMe ? '0' : '8px', borderTopLeftRadius: msg.isMe ? '8px' : '0' }}>
                            
                            {msg.type === 'text' && (
                              <p className="m-0" style={{ fontSize: '14.5px', lineHeight: '19px' }}>{msg.text}</p>
                            )}

                            {msg.type === 'image' && (
                              <div className="position-relative mb-1">
                                <img src={msg.mediaUrl} alt="Shared media" className="img-fluid rounded" style={{ maxWidth: '250px' }} />
                              </div>
                            )}

                            {msg.type === 'audio' && (
                              <div className="d-flex align-items-center gap-3 p-1" style={{ width: '220px' }}>
                                <PlayCircle size={30} className="text-muted" style={{ cursor: 'pointer' }} />
                                <div className="flex-grow-1">
                                  <div className="progress" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '0%' }}></div>
                                  </div>
                                </div>
                                <img src={selectedChat.avatar} alt="mic" className="rounded-circle" width="30" height="30" />
                              </div>
                            )}

                            <div className="d-flex justify-content-end align-items-center gap-1 mt-1">
                              <small className="text-muted" style={{ fontSize: '11px' }}>{msg.time}</small>
                              {msg.isMe && (
                                <span className={msg.readStatus === 'read' ? 'text-info' : 'text-muted'}>
                                  <CheckCheck size={14} />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="card-body d-flex align-items-center justify-content-center flex-column text-muted" style={{ zIndex: 1 }}>
                  <MessageCircle size={48} className="mb-3 opacity-50" />
                  <h5>WhatsApp Web Monitoring</h5>
                  <p>Select a chat to view message history.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
