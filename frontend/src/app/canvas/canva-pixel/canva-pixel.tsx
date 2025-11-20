"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 100;
const PIXEL_SIZE = 10;

// id → (x, y)
function idToCoords(id: number) {
  const x = id % GRID_SIZE;
  const y = Math.floor(id / GRID_SIZE);
  return { x, y };
}

// (x, y) → id
function coordsToId(x: number, y: number) {
  return y * GRID_SIZE + x;
}

export function CanvaPixel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_SIZE * PIXEL_SIZE;
    canvas.height = GRID_SIZE * PIXEL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // remplissage initial
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // on dessine toute la grille en gris clair
    ctx.fillStyle = "#dddddd";
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const { x, y } = idToCoords(i);
      ctx.fillRect(
        x * PIXEL_SIZE,
        y * PIXEL_SIZE,
        PIXEL_SIZE - 1,
        PIXEL_SIZE - 1
      );
    }

    colorPixel(coordsToId(0, 1), "red");
  }, []);

  const colorPixel = (id: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = idToCoords(id);

    ctx.fillStyle = color;
    ctx.fillRect(
      x * PIXEL_SIZE,
      y * PIXEL_SIZE,
      PIXEL_SIZE - 1,
      PIXEL_SIZE - 1
    );
  };

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
