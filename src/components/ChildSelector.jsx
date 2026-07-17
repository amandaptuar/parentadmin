import React, { useEffect, useState } from 'react';
import { useChild } from '../context/ChildContext';
import { getChildren } from '../services/api';

export default function ChildSelector() {
  const { selectedChild, selectChild } = useChild();
  const [children, setChildren] = useState([]);

  useEffect(() => {
    getChildren()
      .then(data => {
        const list = data?.children || data?.data || data || [];
        setChildren(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  if (children.length === 0) return null;

  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <span className="text-muted" style={{ fontSize: 13 }}>Viewing:</span>
      <select
        className="form-control form-control-sm"
        style={{ width: 'auto', minWidth: 160, borderRadius: 20, fontSize: 13 }}
        value={selectedChild?._id || ''}
        onChange={e => {
          const child = children.find(c => c._id === e.target.value);
          if (child) selectChild(child);
        }}
      >
        {!selectedChild && <option value="">— Select a child —</option>}
        {children.map(c => (
          <option key={c._id} value={c._id}>{c.name} ({c.deviceName || 'Device'})</option>
        ))}
      </select>
    </div>
  );
}
