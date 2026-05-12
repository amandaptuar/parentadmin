import React from 'react';
import { Link } from 'react-router-dom';

export default function Topbar({ onLogout, onToggleMenu }) {
  return (
    <div className="topbar">
      <nav className="navbar-custom">
        <div className="dropdown notification-list nav-pro-img">
          <div className="list-inline-item hide-phone app-search">
            <form role="search">
              <div className="form-group pt-1">
                <input type="text" className="form-control" placeholder="Search.." />
                <a href="#"><i className="fa fa-search"></i></a>
              </div>
            </form>
          </div>
        </div>

        <ul className="list-inline float-right mb-0 mr-3">

          {/* Messages dropdown */}
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <i className="ti-email noti-icon"></i>
              <span className="badge badge-danger heartbit noti-icon-badge">5</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
              <div className="dropdown-item noti-title align-self-center">
                <h5><span className="badge badge-danger float-right">745</span>Messages</h5>
              </div>
              <a href="#" className="dropdown-item notify-item">
                <div className="notify-icon">
                  <img src="/assets/images/users/avatar-2.jpg" alt="user-img" className="img-fluid rounded-circle" />
                </div>
                <p className="notify-details"><b>Charles M. Jones</b><small className="text-muted">Dummy text of the printing and typesetting industry.</small></p>
              </a>
              <a href="#" className="dropdown-item notify-item">
                <div className="notify-icon">
                  <img src="/assets/images/users/avatar-3.jpg" alt="user-img" className="img-fluid rounded-circle" />
                </div>
                <p className="notify-details"><b>Thomas J. Mimms</b><small className="text-muted">You have 87 unread messages</small></p>
              </a>
              <Link to="/dashboard/sms" className="dropdown-item notify-item">View All</Link>
            </div>
          </li>

          {/* Notifications dropdown */}
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <i className="ti-bell noti-icon"></i>
              <span className="badge badge-success a-animate-blink noti-icon-badge">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right dropdown-arrow dropdown-menu-lg">
              <div className="dropdown-item noti-title">
                <h5><span className="badge badge-danger float-right">87</span>Notification</h5>
              </div>
              <a href="#" className="dropdown-item notify-item">
                <div className="notify-icon bg-primary"><i className="mdi mdi-cart-outline"></i></div>
                <p className="notify-details"><b>Your order is placed</b><small className="text-muted">Dummy text of the printing and typesetting industry.</small></p>
              </a>
              <a href="#" className="dropdown-item notify-item">
                <div className="notify-icon bg-success"><i className="mdi mdi-message"></i></div>
                <p className="notify-details"><b>New Message received</b><small className="text-muted">You have 87 unread messages</small></p>
              </a>
              <Link to="/dashboard/notifications" className="dropdown-item notify-item">View All</Link>
            </div>
          </li>

          {/* User / Profile dropdown */}
          <li className="list-inline-item dropdown notification-list">
            <a className="nav-link dropdown-toggle arrow-none waves-effect nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
              <img src="/assets/images/users/avatar-1.jpg" alt="user" className="rounded-circle img-thumbnail" />
            </a>
            <div className="dropdown-menu dropdown-menu-right profile-dropdown">
              <div className="dropdown-item noti-title">
                <h5>Welcome</h5>
              </div>
              <Link className="dropdown-item" to="/profile">
                <i className="mdi mdi-account-circle m-r-5 text-muted"></i> Profile
              </Link>
              <Link className="dropdown-item d-block" to="/profile">
                <span className="badge badge-success float-right">5</span>
                <i className="mdi mdi-settings m-r-5 text-muted"></i> Settings
              </Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); onLogout && onLogout(); }}>
                <i className="mdi mdi-logout m-r-5 text-muted"></i> Logout
              </a>
            </div>
          </li>
        </ul>

        <ul className="list-inline menu-left mb-0">
          <li className="float-left">
            <button className="button-menu-mobile open-left waves-light waves-effect" onClick={onToggleMenu}>
              <i className="mdi mdi-menu"></i>
            </button>
          </li>
        </ul>
        <div className="clearfix"></div>
      </nav>
    </div>
  );
}