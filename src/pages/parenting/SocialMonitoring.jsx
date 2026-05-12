import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, Globe, Send, ShieldAlert, Heart, 
  MessageCircle, Users, Activity, Eye, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Camera, color: '#E1306C', bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' },
  { id: 'snapchat', name: 'Snapchat', icon: Activity, color: '#FFFC00', bg: '#FFFC00', textColor: '#000' },
  { id: 'tiktok', name: 'TikTok', icon: Eye, color: '#000000', bg: '#000000' },
  { id: 'telegram', name: 'Telegram', icon: Send, color: '#0088cc', bg: '#0088cc' },
  { id: 'facebook', name: 'Facebook', icon: Globe, color: '#1877F2', bg: '#1877F2' },
];

const engagementData = [
  { day: 'Mon', likes: 120, comments: 45 },
  { day: 'Tue', likes: 200, comments: 80 },
  { day: 'Wed', likes: 150, comments: 50 },
  { day: 'Thu', likes: 300, comments: 120 },
  { day: 'Fri', likes: 250, comments: 90 },
  { day: 'Sat', likes: 400, comments: 150 },
  { day: 'Sun', likes: 380, comments: 140 },
];

const recentActivity = [
  { id: 1, type: 'like', text: 'Liked a post by @stranger99', time: '10 mins ago', risk: 'low' },
  { id: 2, type: 'comment', text: 'Commented: "Looking good!" on @bestfriend\'s photo', time: '1 hour ago', risk: 'low' },
  { id: 3, type: 'dm', text: 'Received message from unknown user', time: '2 hours ago', risk: 'high' },
  { id: 4, type: 'follow', text: 'Started following @suspicious_account', time: '5 hours ago', risk: 'medium' },
];

export const SocialMonitoring = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePlatform, setActivePlatform] = useState(platforms[0]);

  // Sync tab with URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    const platform = platforms.find(p => p.id === path);
    if (platform) {
      setActivePlatform(platform);
    } else {
      setActivePlatform(platforms[0]); // default
    }
  }, [location]);

  const handleTabChange = (platform) => {
    setActivePlatform(platform);
    if (platform.id === platforms[0].id) {
      navigate('/dashboard/social-media');
    } else {
      navigate(`/dashboard/social-media/${platform.id}`);
    }
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <Users className="text-primary" /> Social Media Monitoring
            </h4>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {platforms.map(platform => {
                const Icon = platform.icon;
                const isActive = activePlatform.id === platform.id;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    key={platform.id}
                    onClick={() => handleTabChange(platform)}
                    className={`btn rounded-lg px-4 py-3 d-flex align-items-center gap-2 border-0 shadow-sm ${isActive ? 'text-white' : 'bg-white text-dark'}`}
                    style={{ 
                      background: isActive ? platform.bg : 'white',
                      minWidth: '160px',
                      color: isActive && platform.textColor ? platform.textColor : ''
                    }}
                  >
                    <Icon size={20} color={isActive ? (platform.textColor || 'white') : platform.color} />
                    <span className="font-weight-bold">{platform.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Platform Dashboard */}
        <motion.div 
          key={activePlatform.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Analytics Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-body text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '48px', height: '48px', background: 'rgba(24, 119, 242, 0.1)' }}>
                    <Users className="text-primary" size={24} />
                  </div>
                  <h3 className="m-0 font-weight-bold">1,245</h3>
                  <p className="text-muted mb-0 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Followers</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-body text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '48px', height: '48px', background: 'rgba(225, 48, 108, 0.1)' }}>
                    <Heart className="text-danger" size={24} />
                  </div>
                  <h3 className="m-0 font-weight-bold">4.2K</h3>
                  <p className="text-muted mb-0 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Total Likes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 rounded-lg">
                <div className="card-body text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '48px', height: '48px', background: 'rgba(0, 150, 136, 0.1)' }}>
                    <MessageCircle className="text-success" size={24} />
                  </div>
                  <h3 className="m-0 font-weight-bold">850</h3>
                  <p className="text-muted mb-0 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Comments</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm border-0 rounded-lg bg-danger text-white">
                <div className="card-body text-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 bg-white text-danger" style={{ width: '48px', height: '48px' }}>
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="m-0 font-weight-bold text-white">2</h3>
                  <p className="text-white-50 mb-0 font-weight-bold text-uppercase" style={{ fontSize: '12px' }}>Risk Alerts</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Chart */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100">
                <div className="card-body">
                  <h5 className="header-title mb-4">Engagement Overview ({activePlatform.name})</h5>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#999'}} />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="likes" name="Likes" fill={activePlatform.color} radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="comments" name="Comments" fill="#eaeaea" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm border-0 rounded-lg h-100">
                <div className="card-body">
                  <h5 className="header-title mb-4">Recent Activity</h5>
                  
                  <div className="timeline">
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id} className="d-flex mb-3">
                        <div className="mr-3 mt-1">
                          {activity.risk === 'high' ? (
                            <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                              <AlertTriangle size={16} />
                            </div>
                          ) : (
                            <div className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                              <Activity size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1 border-bottom pb-2">
                          <p className={`m-0 ${activity.risk === 'high' ? 'text-danger font-weight-bold' : 'text-dark'}`} style={{ fontSize: '14px' }}>
                            {activity.text}
                          </p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
