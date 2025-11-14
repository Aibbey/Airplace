"use client";

import { useState } from "react";
import { CirclePicker } from "react-color";
import { CircleCheck, CircleX } from "lucide-react";

export function ColorPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [colors, setColors] = useState(String);

  const colorsLib = [
    "#000000",
    "#696969",
    "#555555",
    "#808080",
    "#FFFFFF",
    "#FF999A",
    "#CC3233",
    "#DC143C",
    "#990001",
    "#800000",
    "#FF5701",
    "#CCFF8C",
    "#81DE75",
    "#016F3C",
    "#3A55B4",
    "#6CADE0",
    "#8BD9FF",
    "#03FFFF",
    "#B87EFF",
    "#BE45FF",
    "#FA3A83",
    "#FF9900",
    "#FFE600",
    "#573400",
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center">
      <button
        onClick={() => setIsPanelOpen(true)}
        className="bg-white px-8 py-3 text-xl text-black rounded-full shadow-xl/50 hover:shadow-xl/100 hover:bg-blue-100 transition-shadow duration-300 "
      >
        Place a pixel
      </button>

      <div
        className={`fixed inset-0 z-10 transition-opacity duration-300 ${
          isPanelOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`
    absolute bottom-4 left-1/2
    w-[90%] max-w-m
    bg-white shadow-2xl p-6 rounded-2xl
    transform transition-transform duration-300
    -translate-x-1/2
    ${isPanelOpen ? "translate-y-0" : "translate-y-full"}
  `}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            {colorsLib.map((color) => (
              <button
                key={color}
                onClick={() => setColors(color)}
                className="h-12 w-12 rounded-md mx-0.5 border border-gray-300 hover:shadow-xl/50 transition-shadow duration-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {/* <div className="text-black">{colors}</div> */}
          <div className="mt-4 mx-auto flex justify-center gap-7">
            <CircleX
              onClick={() => setIsPanelOpen(false)}
              className="mt-2 bg-slate-900 h-10 text-white px-4 py-2 rounded-lg w-50  hover:shadow-xl/50 transition-shadow duration-300"
            />
            <CircleCheck className="mt-2 h-10 bg-slate-900 text-white px-4 py-2 rounded-lg w-50  hover:shadow-xl/50 transition-shadow duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
