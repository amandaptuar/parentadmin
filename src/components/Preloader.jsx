import React, { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    if (window.$) {
      window.$('#status').fadeOut();
      window.$('#preloader').delay(350).fadeOut('slow');
      window.$('body').delay(350).css({
        'overflow': 'visible'
      });
    }
  }, []);

  return (
    <div id="preloader">
      <div id="status">
        <div className="spinner"></div>
      </div>
    </div>
  );
}