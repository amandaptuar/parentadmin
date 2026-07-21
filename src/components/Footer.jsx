import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Vigil Parental Monitoring System. All rights reserved.
    </footer>
  );
}