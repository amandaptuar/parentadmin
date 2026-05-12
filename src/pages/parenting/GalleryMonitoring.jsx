import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Video, MonitorSmartphone, EyeOff, 
  Search, ShieldAlert, Download, Maximize2, X
} from 'lucide-react';

const mediaData = [
  { id: 1, type: 'photo', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', date: 'Today, 10:30 AM', size: '2.4 MB', source: 'Camera', hidden: false, safe: true },
  { id: 2, type: 'video', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500', date: 'Yesterday', size: '15.2 MB', source: 'WhatsApp', hidden: false, safe: true, duration: '0:45' },
  { id: 3, type: 'screenshot', url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500', date: 'Oct 15', size: '1.1 MB', source: 'Snapchat', hidden: false, safe: true },
  { id: 4, type: 'photo', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500', date: 'Oct 14', size: '3.5 MB', source: 'Instagram', hidden: true, safe: false, flagReason: 'Inappropriate Content' },
  { id: 5, type: 'photo', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500', date: 'Oct 12', size: '2.1 MB', source: 'Camera', hidden: true, safe: true },
  { id: 6, type: 'video', url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500', date: 'Oct 10', size: '45.0 MB', source: 'TikTok', hidden: false, safe: true, duration: '1:30' },
  { id: 7, type: 'screenshot', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', date: 'Oct 08', size: '0.8 MB', source: 'Messages', hidden: false, safe: true },
  { id: 8, type: 'photo', url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500', date: 'Oct 05', size: '4.2 MB', source: 'Camera', hidden: false, safe: true },
];

export const GalleryMonitoring = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Media', icon: ImageIcon },
    { id: 'photo', label: 'Photos', icon: ImageIcon },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'screenshot', label: 'Screenshots', icon: MonitorSmartphone },
    { id: 'hidden', label: 'Hidden Vault', icon: EyeOff },
  ];

  const filteredMedia = mediaData.filter(media => {
    const matchesTab = activeTab === 'all' ? true : activeTab === 'hidden' ? media.hidden : media.type === activeTab;
    const matchesSearch = media.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-content-wrapper position-relative">
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ top: 0, left: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)' }}
          >
            <div className="position-absolute" style={{ top: '20px', right: '20px' }}>
              <button 
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                onClick={() => setSelectedMedia(null)}
              >
                <X size={24} className="text-dark" />
              </button>
            </div>
            
            <div className="text-center" style={{ maxWidth: '90%', maxHeight: '90%' }}>
              <motion.img 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                src={selectedMedia.url} 
                alt="Preview" 
                className="img-fluid rounded shadow-lg" 
                style={{ maxHeight: '80vh', objectFit: 'contain' }}
              />
              <div className="mt-3 text-white text-left bg-dark p-3 rounded d-inline-block shadow" style={{ minWidth: '300px' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-2">
                  <h6 className="m-0 font-weight-bold">{selectedMedia.type.charAt(0).toUpperCase() + selectedMedia.type.slice(1)} Info</h6>
                  <button className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center gap-1"><Download size={14} /> Save</button>
                </div>
                <p className="m-0 mb-1 d-flex justify-content-between"><span>Date:</span> <span className="text-muted">{selectedMedia.date}</span></p>
                <p className="m-0 mb-1 d-flex justify-content-between"><span>Source:</span> <span className="text-muted">{selectedMedia.source}</span></p>
                <p className="m-0 d-flex justify-content-between"><span>Size:</span> <span className="text-muted">{selectedMedia.size}</span></p>
                
                {!selectedMedia.safe && (
                  <div className="mt-3 p-2 bg-danger rounded text-center">
                    <ShieldAlert size={16} className="mr-1" /> Flagged: {selectedMedia.flagReason}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <ImageIcon className="text-primary" /> Gallery Monitoring
            </h4>
          </div>
        </div>

        {/* AI Detection Banner */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 bg-dark text-white rounded-lg overflow-hidden" style={{ background: 'linear-gradient(45deg, #2d3b48, #1a2229)' }}>
              <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px' }}>
                    <EyeOff size={24} />
                  </div>
                  <div>
                    <h5 className="m-0 font-weight-bold mb-1">Hidden Vault Detected</h5>
                    <p className="text-white-50 m-0" style={{ fontSize: '14px' }}>AI scanner found 2 items stored in hidden folders or disguised apps.</p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary rounded-pill font-weight-bold px-4 shadow-sm"
                  onClick={() => setActiveTab('hidden')}
                >
                  View Hidden Media
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-2 overflow-auto" style={{ scrollbarWidth: 'none' }}>
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

            <div className="position-relative">
              <Search className="position-absolute text-muted" size={16} style={{ left: '12px', top: '12px' }} />
              <input 
                type="text" 
                className="form-control pl-5 rounded-pill shadow-sm border-0 py-2" 
                placeholder="Search source (e.g. Snapchat)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px' }}
              />
            </div>
          </div>
        </div>

        {/* Masonry Media Grid */}
        <div className="row">
          <AnimatePresence>
            {filteredMedia.length > 0 ? filteredMedia.map((media, index) => (
              <div key={media.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="card border-0 rounded-lg overflow-hidden shadow-sm h-100 position-relative group"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedMedia(media)}
                >
                  {/* Media Image (with safe blur if flagged) */}
                  <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                    <img 
                      src={media.url} 
                      alt="Media" 
                      className="w-100 h-100" 
                      style={{ 
                        objectFit: 'cover', 
                        filter: !media.safe ? 'blur(15px)' : 'none',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                    
                    {/* Hover Overlay */}
                    <div 
                      className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center flex-column text-white" 
                      style={{ top: 0, left: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <Maximize2 size={32} className="mb-2" />
                      <span className="font-weight-bold">View Fullscreen</span>
                    </div>

                    {/* Badges */}
                    <div className="position-absolute w-100 p-2 d-flex justify-content-between align-items-start" style={{ top: 0, left: 0 }}>
                      {media.type === 'video' && (
                        <span className="badge badge-dark rounded-pill d-flex align-items-center gap-1 shadow-sm"><Video size={12} /> {media.duration}</span>
                      )}
                      {!media.safe && (
                        <span className="badge badge-danger rounded-pill shadow-sm ml-auto d-flex align-items-center gap-1"><ShieldAlert size={12} /> Flagged</span>
                      )}
                      {media.hidden && media.safe && (
                        <span className="badge badge-secondary rounded-pill shadow-sm ml-auto d-flex align-items-center gap-1"><EyeOff size={12} /> Hidden</span>
                      )}
                    </div>
                  </div>

                  <div className="card-body p-3 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h6 className="m-0 font-weight-bold text-dark text-truncate" style={{ fontSize: '14px' }}>{media.source}</h6>
                      <small className="text-muted" style={{ fontSize: '12px' }}>{media.size}</small>
                    </div>
                    <small className="text-muted d-block">{media.date}</small>
                  </div>
                </motion.div>
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <div className="text-muted">
                  <ImageIcon size={48} className="mb-3 opacity-50" />
                  <h5>No media found</h5>
                  <p>There are no items matching your current filters.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
