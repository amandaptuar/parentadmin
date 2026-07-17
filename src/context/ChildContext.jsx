import React, { createContext, useContext, useState } from 'react';

const ChildContext = createContext(null);

export function ChildProvider({ children }) {
  const [selectedChild, setSelectedChild] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vigil_selected_child') || 'null'); } catch { return null; }
  });

  const selectChild = (child) => {
    setSelectedChild(child);
    if (child) localStorage.setItem('vigil_selected_child', JSON.stringify(child));
    else localStorage.removeItem('vigil_selected_child');
  };

  return (
    <ChildContext.Provider value={{ selectedChild, selectChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export const useChild = () => useContext(ChildContext);
