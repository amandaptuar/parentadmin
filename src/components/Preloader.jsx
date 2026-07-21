import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div id="preloader">
      <div id="status">
        <div className="spinner"></div>
      </div>
    </div>
  );
}