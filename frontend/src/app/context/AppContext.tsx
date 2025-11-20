"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AppContextType = {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        isPanelOpen,
        setIsPanelOpen,
        isLoginOpen,
        setIsLoginOpen,
        isAboutOpen,
        setIsAboutOpen,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext doit être utilisé dans un <AppProvider>");
  }
  return ctx;
}
