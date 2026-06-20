import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ onClose }) {
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? '' : menu);
  };

  return (
    <div className="left side-menu">
      <button type="button" onClick={onClose} className="button-menu-mobile button-menu-mobile-topbar open-left waves-effect">
          <i className="mdi mdi-close"></i>
      </button>

      <div className="topbar-left">
          <div className="text-center">
              <Link to="/" className="logo">
                  <img src="/image.png" alt="logo" className="logo-large" style={{ height: '60px', maxWidth: '200px', objectFit: 'contain' }} />
              </Link>
          </div>
      </div>

      <div className="sidebar-inner slimscrollleft" id="sidebar-main">
          <div id="sidebar-menu">
              <ul>
                  <li className="menu-title">Main</li>

                  <li>
                      <Link to="/" className="waves-effect">
                          <i className="mdi mdi-view-dashboard"></i>
                          <span> Dashboard
                              <span className="badge badge-pill badge-primary float-right">7</span>
                          </span>
                      </Link>
                  </li>

                  <li>
                      <Link to="/profile" className="waves-effect">
                          <i className="mdi mdi-account-circle"></i>
                          <span> Profile</span>
                      </Link>
                  </li>

                  <li>
                      <Link to="/help-center" className="waves-effect">
                          <i className="mdi mdi-help-circle-outline"></i>
                          <span> Help Center</span>
                      </Link>
                  </li>


                  <li className="menu-title">PARENT MONITORING</li>

                  <li>
                      <Link to="/dashboard/live-activity" className="waves-effect">
                          <i className="mdi mdi-pulse"></i>
                          <span> Live Activity </span>
                      </Link>
                  </li>

                  <li className={`has_sub ${openMenu === 'calls' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('calls'); }} className="waves-effect">
                          <i className="mdi mdi-phone-log"></i>
                          <span> Calls </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'calls' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'calls' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/calls">Overview</Link></li>
                          <li><Link to="/dashboard/calls/incoming">Incoming</Link></li>
                          <li><Link to="/dashboard/calls/outgoing">Outgoing</Link></li>
                          <li><Link to="/dashboard/calls/missed">Missed</Link></li>
                          <li><Link to="/dashboard/calls/recorded">Recorded</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'sms' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('sms'); }} className="waves-effect">
                          <i className="mdi mdi-message-text"></i>
                          <span> SMS </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'sms' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'sms' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/sms">Overview</Link></li>
                          <li><Link to="/dashboard/sms/inbox">Inbox</Link></li>
                          <li><Link to="/dashboard/sms/sent">Sent</Link></li>
                          <li><Link to="/dashboard/sms/alerts">AI Alerts</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'whatsapp' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('whatsapp'); }} className="waves-effect">
                          <i className="mdi mdi-whatsapp"></i>
                          <span> WhatsApp </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'whatsapp' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'whatsapp' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/whatsapp">Overview</Link></li>
                          <li><Link to="/dashboard/whatsapp/chats">Chat Activity</Link></li>
                          <li><Link to="/dashboard/whatsapp/media">Media Sharing</Link></li>
                          <li><Link to="/dashboard/whatsapp/voice">Voice Notes</Link></li>
                          <li><Link to="/dashboard/whatsapp/groups">Group Activity</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'social' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('social'); }} className="waves-effect">
                          <i className="mdi mdi-instagram"></i>
                          <span> Social Media </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'social' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'social' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/social-media">Overview</Link></li>
                          <li><Link to="/dashboard/social-media/instagram">Instagram</Link></li>
                          <li><Link to="/dashboard/social-media/snapchat">Snapchat</Link></li>
                          <li><Link to="/dashboard/social-media/tiktok">TikTok</Link></li>
                          <li><Link to="/dashboard/social-media/telegram">Telegram</Link></li>
                          <li><Link to="/dashboard/social-media/facebook">Facebook</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'gallery' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('gallery'); }} className="waves-effect">
                          <i className="mdi mdi-folder-multiple-image"></i>
                          <span> Gallery </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'gallery' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'gallery' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/gallery">Overview</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'location' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('location'); }} className="waves-effect">
                          <i className="mdi mdi-map-marker-radius"></i>
                          <span> Location </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'location' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'location' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/location">Overview</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'screen' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('screen'); }} className="waves-effect">
                          <i className="mdi mdi-cellphone-lock"></i>
                          <span> Screen Time </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'screen' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'screen' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/screen-time">Overview</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'reports' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('reports'); }} className="waves-effect">
                          <i className="mdi mdi-chart-areaspline"></i>
                          <span> Reports </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'reports' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'reports' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/reports">Overview</Link></li>
                      </ul>
                  </li>

                  <li className={`has_sub ${openMenu === 'notifications' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('notifications'); }} className="waves-effect">
                          <i className="mdi mdi-bell-ring"></i>
                          <span> Notifications </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'notifications' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'notifications' ? 'block' : 'none' }}>
                          <li><Link to="/dashboard/notifications">Overview</Link></li>
                      </ul>
                  </li>

                  <li className="menu-title">Extra</li>

                  <li className={`has_sub ${openMenu === 'extra' ? 'nav-active' : ''}`}>
                      <a href="#!" onClick={(e) => { e.preventDefault(); toggleMenu('extra'); }} className="waves-effect">
                          <i className="mdi mdi-layers"></i>
                          <span> Pages </span>
                          <span className="float-right">
                              <i className={`mdi ${openMenu === 'extra' ? 'mdi-chevron-down' : 'mdi-chevron-right'}`}></i>
                          </span>
                      </a>
                      <ul className="list-unstyled" style={{ display: openMenu === 'extra' ? 'block' : 'none' }}>
                          <li>
                              <Link to="/login">Login</Link>
                          </li>
                          <li>
                              <Link to="/register">Register</Link>
                          </li>
                      </ul>
                  </li>
              </ul>
          </div>
          <div className="clearfix"></div>
      </div>
    </div>
  );
}