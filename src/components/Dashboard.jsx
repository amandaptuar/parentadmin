import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Battery, Wifi, WifiOff } from 'lucide-react';

const childrenData = [
  {
    id: 1,
    name: 'Emma',
    photo: 'https://i.pravatar.cc/150?u=emma',
    device: 'iPhone 13',
    battery: 84,
    status: 'online'
  },
  {
    id: 2,
    name: 'Noah',
    photo: 'https://i.pravatar.cc/150?u=noah',
    device: 'Galaxy S22',
    battery: 12,
    status: 'offline'
  },
  {
    id: 3,
    name: 'Sophia',
    photo: 'https://i.pravatar.cc/150?u=sophia',
    device: 'iPad Pro',
    battery: 100,
    status: 'online'
  }
];

export default function Dashboard() {
  useEffect(() => {
    // Re-initialize any global template scripts if needed
    if (window.UroraApp && typeof window.UroraApp.init === 'function') {
      try {
        window.UroraApp.init();
      } catch (e) {
        console.error("Dashboard init error:", e);
      }
    }
  }, []);

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">

        {/* Dashboard Top Section */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-6">
            <div className="d-flex align-items-center gap-3">
              <img src="https://i.pravatar.cc/150?u=parent" alt="Parent Profile" className="rounded-circle shadow-sm" width="60" height="60" />
              <div>
                <h4 className="page-title m-0">Welcome back, Sarah</h4>
                <p className="text-muted m-0">You're monitoring 3 devices today.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0 gap-3">
            <div className="d-flex align-items-center bg-white px-3 py-2 rounded-pill shadow-sm border border-success">
              <ShieldCheck className="text-success mr-2" size={18} />
              <span className="font-weight-bold text-success" style={{ fontSize: '13px' }}>Premium Active</span>
            </div>
            <Link to="/dashboard/notifications">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="btn btn-light rounded-circle shadow-sm p-2 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <div className="position-relative">
                  <Bell size={20} className="text-dark" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ right: '-5px', top: '-5px' }}>
                    2
                  </span>
                </div>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Child Profiles Carousel */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="header-title mb-4">Monitored Devices</h5>
            
            {/* Horizontal Scroll Container */}
            <div className="d-flex gap-4 overflow-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              
              {childrenData.map((child, index) => (
                <motion.div 
                  key={child.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                  className="card border-0 flex-shrink-0"
                  style={{ width: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                >
                  <div className="card-body text-center position-relative">
                    
                    {/* Status Indicator Top Right */}
                    <div className="position-absolute d-flex align-items-center gap-1 px-2 py-1 rounded-pill" 
                         style={{ top: '15px', right: '15px', background: child.status === 'online' ? 'rgba(0, 150, 136, 0.1)' : 'rgba(153, 153, 153, 0.1)' }}>
                      {child.status === 'online' ? (
                        <>
                          <Wifi size={12} className="text-success" />
                          <small className="text-success font-weight-bold">Online</small>
                        </>
                      ) : (
                        <>
                          <WifiOff size={12} className="text-muted" />
                          <small className="text-muted font-weight-bold">Offline</small>
                        </>
                      )}
                    </div>

                    <img src={child.photo} alt={child.name} className="rounded-circle shadow mt-3 mb-3" width="80" height="80" style={{ border: '3px solid white' }} />
                    <h5 className="m-0 font-weight-bold">{child.name}</h5>
                    <p className="text-muted mb-3"><small>{child.device}</small></p>

                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                      <div className="d-flex align-items-center gap-2">
                        <Battery size={16} className={child.battery > 20 ? 'text-success' : 'text-danger'} />
                        <span className="font-weight-bold">{child.battery}%</span>
                      </div>
                      <Link to="/dashboard/live-activity" className="btn btn-sm btn-outline-primary rounded-pill px-3">View Activity</Link>
                    </div>

                  </div>
                </motion.div>
              ))}

              {/* Add Device Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => alert('Add device wizard will open here.')}
                className="card border-0 flex-shrink-0 d-flex justify-content-center align-items-center"
                style={{ width: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.5)', border: '2px dashed #ccc !important', cursor: 'pointer' }}
              >
                <div className="text-center text-muted">
                  <div className="rounded-circle bg-white shadow-sm d-flex justify-content-center align-items-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                    <i className="mdi mdi-plus text-primary" style={{ fontSize: '24px' }}></i>
                  </div>
                  <h6 className="font-weight-bold mt-3">Add Device</h6>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}