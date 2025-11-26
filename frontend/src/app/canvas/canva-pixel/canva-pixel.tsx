"use client";

import { useEffect } from "react";
import { GRID_SIZE, PIXEL_SIZE } from "@/constants/constants";

type CanvaPixelProps = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

// id → (x, y)
function idToCoords(id: number) {
  const x = id % GRID_SIZE;
  const y = Math.floor(id / GRID_SIZE);
  return { x, y };
}

// (x, y) → id
export function coordsToId(x: number, y: number) {
  return y * GRID_SIZE + x;
}

export function CanvaPixel({ canvasRef }: CanvaPixelProps) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_SIZE * PIXEL_SIZE;
    canvas.height = GRID_SIZE * PIXEL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#dddddd";
  }, [canvasRef]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          imageRendering: "pixelated",
          display: "block",
        }}
      />
    </div>
  );
}
