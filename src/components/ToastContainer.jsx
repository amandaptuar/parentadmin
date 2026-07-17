import React, { useState, useEffect } from 'react';
import { subscribe } from '../utils/toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} className="text-success" />,
  error:   <XCircle    size={18} className="text-danger"  />,
  info:    <Info       size={18} className="text-primary" />,
};

const BG = {
  success: '#f0fff4',
  error:   '#fff5f5',
  info:    '#eff6ff',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribe((t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000);
    });
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 280, maxWidth: 360 }}>
      {toasts.map(t => (
        <div key={t.id}
          style={{ background: BG[t.type] || '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10, animation: 'slideIn 0.2s ease' }}>
          {ICONS[t.type]}
          <span style={{ flex: 1, fontSize: 14, color: '#2d3748' }}>{t.message}</span>
          <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#999' }}>
            <X size={14} />
          </button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
