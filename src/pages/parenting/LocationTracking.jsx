import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, History, RefreshCw, Navigation, ShieldAlert } from 'lucide-react';
import { getChildLocation, getLocationHistory, getGeoZones, getParentId } from '../../services/api';
import { useChild } from '../../context/ChildContext';
import ChildSelector from '../../components/ChildSelector';

export const LocationTracking = () => {
  const { selectedChild }   = useChild();
  const [location, setLocation]   = useState(null);
  const [history, setHistory]     = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading]     = useState(false);

  const fetchAll = useCallback(async () => {
    if (!selectedChild?._id) return;
    setLoading(true);
    try {
      const [loc, hist] = await Promise.allSettled([
        getChildLocation(selectedChild._id),
        getLocationHistory(selectedChild._id, 24),
      ]);
      if (loc.status   === 'fulfilled') setLocation(loc.value);
      if (hist.status  === 'fulfilled') setHistory(hist.value?.locations || hist.value || []);

      // geofences use parent_id + child_id as strings
      const parentId = getParentId();
      if (parentId) {
        const gz = await getGeoZones(parentId, selectedChild._id).catch(() => null);
        setGeofences(gz?.geozones || gz?.data || gz || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const lat = location?.location?.lat ?? location?.location?.latitude ?? null;
  const lng = location?.location?.lng ?? location?.location?.longitude ?? null;
  const hasCoords = lat !== null && lng !== null;

  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008},${lat - 0.008},${lng + 0.008},${lat + 0.008}&marker=${lat},${lng}&layer=mapnik`
    : null;

  const formatTime = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MapPin className="text-primary" /> Live GPS Tracking
            </h4>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end gap-2">
            <ChildSelector />
            <button className="btn btn-light btn-sm" onClick={fetchAll} title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {!selectedChild ? (
          <div className="card border-0 shadow-sm text-center py-5 text-muted">
            <MapPin size={40} className="mx-auto mb-3 opacity-50" />
            <h5>Select a child above to view location</h5>
          </div>
        ) : (
          <div className="row">

            {/* Map area */}
            <div className="col-lg-8 mb-4">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ height: 500 }}>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div> Loading map...
                  </div>
                ) : !hasCoords ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <MapPin size={40} className="mb-3 opacity-50" />
                    <h6>No location data available</h6>
                    <small>The child device has not reported its location yet.</small>
                  </div>
                ) : (
                  <>
                    <iframe
                      title="child-location-map"
                      src={mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 'none' }}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {/* Info bar on top */}
                    <div className="position-absolute bottom-0 start-0 end-0 p-3"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                      <div className="d-flex align-items-center gap-2 text-white">
                        <MapPin size={16} />
                        <span style={{ fontSize: 13 }}>
                          {location.address || `${lat?.toFixed(5)}, ${lng?.toFixed(5)}`}
                        </span>
                        <span className="ms-auto opacity-75" style={{ fontSize: 12 }}>
                          Last seen {formatTime(location.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right panel */}
            <div className="col-lg-4 mb-4">

              {/* Geofences */}
              {geofences.length > 0 && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="m-0 font-weight-bold d-flex align-items-center gap-2">
                      <ShieldAlert size={16} className="text-primary" /> Active Geofences
                    </h6>
                  </div>
                  <div className="card-body p-0">
                    <ul className="list-group list-group-flush">
                      {geofences.map(gz => (
                        <li key={gz._id} className="list-group-item border-0 px-4 py-3 d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="m-0 font-weight-bold">{gz.label}</h6>
                            <small className="text-muted">{gz.radiusMeters}m radius</small>
                          </div>
                          <span className={`badge rounded-pill ${gz.isActive ? 'bg-success' : 'bg-secondary'}`}
                            style={{ fontSize: 11 }}>
                            {gz.isActive ? 'Active' : 'Off'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Location history */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="m-0 font-weight-bold d-flex align-items-center gap-2">
                    <History size={16} className="text-primary" /> Recent Locations (24h)
                  </h6>
                </div>
                <div className="card-body overflow-auto" style={{ maxHeight: geofences.length > 0 ? 260 : 420 }}>
                  {loading ? (
                    <div className="text-center text-muted py-3">
                      <div className="spinner-border spinner-border-sm text-primary me-1"></div> Loading...
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-muted text-center py-3 m-0">No history in the last 24 hours.</p>
                  ) : (
                    <div>
                      {history.slice(0, 20).map((loc, idx) => (
                        <motion.div key={loc._id || idx}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                          className="d-flex gap-3 mb-3">
                          <div className="d-flex flex-column align-items-center" style={{ flexShrink: 0 }}>
                            <div className={`rounded-circle d-flex align-items-center justify-content-center ${idx === 0 ? 'bg-primary' : 'bg-light border'}`}
                              style={{ width: 28, height: 28 }}>
                              <Navigation size={12} className={idx === 0 ? 'text-white' : 'text-muted'} />
                            </div>
                            {idx < history.slice(0, 20).length - 1 && (
                              <div style={{ width: 2, height: 24, background: '#e0e0e0', marginTop: 3 }} />
                            )}
                          </div>
                          <div className="flex-grow-1" style={{ marginTop: 2 }}>
                            <p className="m-0" style={{ fontSize: 13, fontWeight: 600 }}>
                              {loc.address || `${parseFloat(loc.latitude||0).toFixed(4)}, ${parseFloat(loc.longitude||0).toFixed(4)}`}
                            </p>
                            <small className="text-muted">{formatTime(loc.date || loc.timestamp)}</small>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
