"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GRID_SIZE } from "../../constants/constants";

export type Point = { x: number; y: number };
export type Coord = { x: number; y: number; zoom: number };

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
  pixelPosition: Point;
  setPixelPosition: (position: Point | ((prev: Point) => Point)) => void;
  canvasPosition: Point;
  setCanvasPosition: (position: Point | ((prev: Point) => Point)) => void;
  canvasScale: number;
  setCanvasScale: (scale: number | ((prev: number) => number)) => void;
  shouldZoom: boolean;
  setShouldZoom: (zoom: boolean) => void;
  targetPixel: Coord | null;
  setTargetPixel: (
    position: Coord | null | ((prev: Coord | null) => Coord | null)
  ) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [pixelPosition, setPixelPosition] = useState<Point>({
    x: Math.floor(GRID_SIZE / 2),
    y: Math.floor(GRID_SIZE / 2),
  });
  const [canvasPosition, setCanvasPosition] = useState<Point>({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState<number>(0.5);
  const [shouldZoom, setShouldZoom] = useState(false);
  const [targetPixel, setTargetPixel] = useState<Coord | null>(null);
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
        pixelPosition,
        setPixelPosition,
        canvasPosition,
        setCanvasPosition,
        canvasScale,
        setCanvasScale,
        shouldZoom,
        setShouldZoom,
        targetPixel,
        setTargetPixel,
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
