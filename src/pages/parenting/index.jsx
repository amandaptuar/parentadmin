import React from 'react';

const PagePlaceholder = ({ title }) => (
  <div className="page-content-wrapper">
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="page-title-box">
            <h4 className="page-title">{title}</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="header-title">{title} Content</h5>
              <p className="text-muted">This module is under construction.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export { LiveActivity } from './LiveActivity';
export { CallsMonitoring } from './CallsMonitoring';
export { SmsMonitoring } from './SmsMonitoring';
export { WhatsappMonitoring } from './WhatsappMonitoring';
export { SocialMonitoring } from './SocialMonitoring';
export { GalleryMonitoring } from './GalleryMonitoring';
export { LocationTracking } from './LocationTracking';
export { ScreenTime } from './ScreenTime';
export { Reports } from './Reports';
export { NotificationsCenter } from './NotificationsCenter';
