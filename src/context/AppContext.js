// ============================================================
// REQUIREMENT 3: useContext
// A Context is a shared "notice board" for the whole app.
// The Provider (placed once in App.js) puts the app data on the board:
//   value = { store (xp, name, badges...), update(), go(), back(), ... }
// Any component, however deeply nested, can READ it (and call update())
// with useApp(), without the value being passed through every parent.
// ============================================================
import React, { createContext, useContext } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ value, children }) => <AppContext.Provider value={value}>{children}</AppContext.Provider>;

// Small helper hook so components can write:  const { store, update } = useApp();
export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside <AppProvider> (see App.js)');
  return value;
};
