import React, { createContext, useContext, useEffect } from "react";

import { setStatusBarStyle, StatusBar } from "expo-status-bar";

type StatusBarContextType = {
  updateStatusBarStyle: (style: "light" | "dark") => void;
};

const StatusBarContext = createContext<StatusBarContextType | null>(null);

export function StatusBarProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure status bar style persists
    updateStatusBarStyle("dark");
  }, []);

  function updateStatusBarStyle(style: "light" | "dark") {
    setStatusBarStyle(style, true);
  }

  return (
    <StatusBarContext.Provider value={{ updateStatusBarStyle }}>
      <StatusBar style="dark" animated={true} />
      {children}
    </StatusBarContext.Provider>
  );
}

export const useStatusBar = () => {
  const context = useContext(StatusBarContext);
  if (!context) {
    throw new Error("useStatusBar must be used within a StatusBarProvider");
  }
  return context;
};
