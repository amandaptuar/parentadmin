import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Video, Search, Download, Maximize2, X
} from 'lucide-react';
import { getChildFiles } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

function formatSize(bytes) {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return d.toLocaleDateString();
}

export const GalleryMonitoring = () => {
  const { selectedChild } = useChild();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'all',   label: 'All Media', icon: ImageIcon },
    { id: 'image', label: 'Photos',    icon: ImageIcon },
    { id: 'video', label: 'Videos',    icon: Video },
  ];

  const fetchFiles = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const params = activeTab !== 'all' ? { file_type: activeTab } : {};
      const data = await getChildFiles(selectedChild._id, params);
      setFiles(data.files || []);
    } catch (err) {
      console.error(err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChild, activeTab]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const filteredMedia = files.filter(media =>
    (media.album_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {selectedMedia.type === 'video' ? (
                <video src={selectedMedia.url} controls className="rounded shadow-lg" style={{ maxHeight: '75vh', maxWidth: '100%' }} />
              ) : (
                <motion.img
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  src={selectedMedia.url}
                  alt="Preview"
                  className="img-fluid rounded shadow-lg"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
              )}
              <div className="mt-3 text-white text-left bg-dark p-3 rounded d-inline-block shadow" style={{ minWidth: '300px' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-2">
                  <h6 className="m-0 font-weight-bold">{(selectedMedia.type || 'file').charAt(0).toUpperCase() + (selectedMedia.type || 'file').slice(1)} Info</h6>
                  <a href={selectedMedia.url} download target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center gap-1"><Download size={14} /> Save</a>
                </div>
                <p className="m-0 mb-1 d-flex justify-content-between"><span>Date:</span> <span className="text-muted">{formatDate(selectedMedia.captured_at)}</span></p>
                <p className="m-0 mb-1 d-flex justify-content-between"><span>Album:</span> <span className="text-muted">{selectedMedia.album_name || '—'}</span></p>
                <p className="m-0 d-flex justify-content-between"><span>Size:</span> <span className="text-muted">{formatSize(selectedMedia.size_bytes)}</span></p>
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
            <ChildSelector />
          </div>
        </div>

        {!selectedChild ? (
          <div className="text-center text-muted py-5">Select a child to view their gallery.</div>
        ) : (
          <>
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
                    placeholder="Search album"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '250px' }}
                  />
                </div>
              </div>
            </div>

            {/* Media Grid */}
            <div className="row">
              {loading ? (
                <div className="col-12 text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm me-2"></div> Loading...
                </div>
              ) : (
                <AnimatePresence>
                  {filteredMedia.length > 0 ? filteredMedia.map((media) => (
                    <div key={media._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="card border-0 rounded-lg overflow-hidden shadow-sm h-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedMedia(media)}
                      >
                        <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
                          <img
                            src={media.url}
                            alt={media.title || 'Media'}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                          />
                          <div
                            className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center flex-column text-white"
                            style={{ top: 0, left: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                          >
                            <Maximize2 size={32} className="mb-2" />
                            <span className="font-weight-bold">View Fullscreen</span>
                          </div>
                          {media.type === 'video' && (
                            <div className="position-absolute w-100 p-2" style={{ top: 0, left: 0 }}>
                              <span className="badge badge-dark rounded-pill d-flex align-items-center gap-1 shadow-sm" style={{ width: 'fit-content' }}>
                                <Video size={12} /> {media.duration_seconds ? `${media.duration_seconds}s` : 'Video'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="card-body p-3 bg-white">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="m-0 font-weight-bold text-dark text-truncate" style={{ fontSize: '14px' }}>{media.album_name || 'Camera'}</h6>
                            <small className="text-muted" style={{ fontSize: '12px' }}>{formatSize(media.size_bytes)}</small>
                          </div>
                          <small className="text-muted d-block">{formatDate(media.captured_at)}</small>
                        </div>
                      </motion.div>
                    </div>
                  )) : (
                    <div className="col-12 text-center py-5">
                      <div className="text-muted">
                        <ImageIcon size={48} className="mb-3 opacity-50" />
                        <h5>No media found</h5>
                        <p>Photos and videos captured from the child's device will appear here.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
