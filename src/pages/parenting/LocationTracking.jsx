import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Map, ShieldAlert, History, Navigation, 
  Settings, CheckCircle, Crosshair
} from 'lucide-react';

const locationHistory = [
  { id: 1, place: 'Central High School', time: '08:15 AM - 03:00 PM', duration: '6h 45m', safeZone: true },
  { id: 2, place: 'In Transit', time: '03:00 PM - 03:20 PM', duration: '20m', safeZone: false },
  { id: 3, place: 'Home', time: '03:20 PM - Present', duration: 'Live', safeZone: true },
];

const geofences = [
  { id: 1, name: 'Home', radius: '50m', status: 'Active', alerts: 'Enter/Exit' },
  { id: 2, name: 'School', radius: '200m', status: 'Active', alerts: 'Enter/Exit' },
  { id: 3, name: 'Downtown', radius: '500m', status: 'Restricted', alerts: 'Enter Only' },
];

export const LocationTracking = () => {
  const [activeTab, setActiveTab] = useState('live');

  const tabs = [
    { id: 'live', label: 'Real-Time Map', icon: Map },
    { id: 'geofence', label: 'Geo-Fence Alerts', icon: ShieldAlert },
    { id: 'history', label: 'Route History', icon: History },
    { id: 'sos', label: 'SOS Tracking', icon: Navigation },
  ];

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <MapPin className="text-primary" /> Live GPS Tracking
            </h4>
            
            <button onClick={() => alert('Opening geofence alert details...')} className="btn btn-sm btn-outline-danger rounded-pill">View Details</button>
            <button className="btn btn-danger rounded-pill shadow-sm font-weight-bold d-flex align-items-center gap-2">
              <ShieldAlert size={16} /> SOS Alert Mode
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
          
          {/* Main Map Area (Mocked with an image/iframe wrapper) */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0 rounded-lg overflow-hidden position-relative" style={{ height: '600px' }}>
              {/* Fake Map Background */}
              <div 
                className="w-100 h-100" 
                style={{ 
                  background: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200") center/cover',
                  filter: 'grayscale(0.3) contrast(1.1)',
                }}
              />
              
              {/* Map Overlay Controls */}
              <div className="position-absolute p-3 d-flex flex-column gap-2" style={{ right: 0, top: 0 }}>
                <button onClick={() => alert('Recentering map to target location...')} className="btn btn-white shadow-sm rounded p-2"><Crosshair size={20} className="text-dark" /></button>
                <button onClick={() => alert('Opening map settings...')} className="btn btn-white shadow-sm rounded p-2"><Settings size={20} className="text-dark" /></button>
              </div>

              {/* Animated Live Marker */}
              <motion.div 
                className="position-absolute"
                style={{ top: '45%', left: '50%', x: '-50%', y: '-50%' }}
              >
                {/* Pulse ring */}
                <motion.div 
                  animate={{ scale: [1, 2.5, 3], opacity: [0.6, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                  className="position-absolute rounded-circle bg-primary"
                  style={{ width: '40px', height: '40px', top: -5, left: -10, zIndex: 1 }}
                />
                
                {/* Marker body */}
                <div className="position-relative z-10 d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
                  <div className="bg-primary text-white px-3 py-1 rounded shadow-sm font-weight-bold mb-1" style={{ fontSize: '13px' }}>
                    Emma is here
                  </div>
                  <div className="rounded-circle border border-white border-2 shadow-lg overflow-hidden" style={{ width: '40px', height: '40px' }}>
                    <img src="https://i.pravatar.cc/150?u=emma" className="w-100 h-100" alt="Emma" />
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '10px solid white', marginTop: '-2px' }}></div>
                </div>
              </motion.div>

              {/* Fake Geo-Fence Overlay */}
              <div 
                className="position-absolute rounded-circle border border-success" 
                style={{ 
                  width: '300px', height: '300px', 
                  top: '50%', left: '45%', 
                  transform: 'translate(-50%, -50%)', 
                  background: 'rgba(0, 150, 136, 0.1)',
                  pointerEvents: 'none'
                }}
              ></div>

            </div>
          </div>

          {/* Right Panel (History & Fences) */}
          <div className="col-lg-4 mb-4">
            
            {/* Geo-Fence Status */}
            <div className="card shadow-sm border-0 rounded-lg mb-4">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold d-flex align-items-center gap-2"><ShieldAlert size={18} className="text-primary"/> Active Geofences</h6>
                <button onClick={() => alert('Opening geofence management...')} className="btn btn-sm btn-link text-primary p-0">Manage</button>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {geofences.map(fence => (
                    <li key={fence.id} className="list-group-item p-3 border-0" style={{ borderBottom: '1px solid #f8f9fa !important' }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="m-0 font-weight-bold mb-1">{fence.name}</h6>
                          <small className="text-muted">{fence.radius} Radius • {fence.alerts}</small>
                        </div>
                        <div className="custom-control custom-switch">
                          <input type="checkbox" className="custom-control-input" id={`switch${fence.id}`} defaultChecked={fence.status === 'Active'} />
                          <label className="custom-control-label" htmlFor={`switch${fence.id}`}></label>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Today's Route History */}
            <div className="card shadow-sm border-0 rounded-lg h-100">
              <div className="card-body">
                <h6 className="m-0 font-weight-bold d-flex align-items-center gap-2 mb-4"><History size={18} className="text-primary"/> Today's Route Timeline</h6>
                
                <div className="timeline">
                  {locationHistory.map((loc, index) => (
                    <div key={loc.id} className="d-flex mb-4">
                      <div className="mr-3 mt-1 position-relative">
                        <div className={`rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm ${loc.safeZone ? 'bg-success' : 'bg-warning'}`} style={{ width: '32px', height: '32px' }}>
                          {loc.safeZone ? <CheckCircle size={16} /> : <Navigation size={16} />}
                        </div>
                        {index !== locationHistory.length - 1 && (
                          <div className="position-absolute bg-light" style={{ width: '2px', height: '100%', left: '15px', top: '32px' }}></div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="m-0 font-weight-bold" style={{ fontSize: '14px' }}>{loc.place}</h6>
                        <div className="d-flex justify-content-between mt-1">
                          <small className="text-muted">{loc.time}</small>
                          <small className="font-weight-bold text-primary">{loc.duration}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
