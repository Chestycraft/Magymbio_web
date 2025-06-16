"use client";

import { useState } from "react";

export default function PositionPlayground() {
  const [horizontal, setHorizontal] = useState("justify-start");
  const [vertical, setVertical] = useState("items-start");

  const [boxWidth, setBoxWidth] = useState(96);
  const [boxHeight, setBoxHeight] = useState(96);

  const [marginTop, setMarginTop] = useState(0);
  const [marginRight, setMarginRight] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  const parentClass = `flex ${vertical} ${horizontal} h-screen bg-gray-100 border border-gray-400`;

  const boxStyle = {
    width: `${boxWidth}px`,
    height: `${boxHeight}px`,
    marginTop: `${marginTop}px`,
    marginRight: `${marginRight}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
  };

  const childClass = [
    "bg-blue-500",
    "text-white",
    "flex",
    "items-center",
    "justify-center",
    "rounded",
  ].join(" ");

  const childTailwindString = [
    "bg-blue-500",
    "text-white",
    "flex",
    "items-center",
    "justify-center",
    "rounded",
    `w-[${boxWidth}px]`,
    `h-[${boxHeight}px]`,
    `mt-[${marginTop}px]`,
    `mr-[${marginRight}px]`,
    `mb-[${marginBottom}px]`,
    `ml-[${marginLeft}px]`,
  ].join(" ");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Tailwind Position Playground</h1>

      {/* Controls */}
      <div className="space-y-6 border p-4 rounded bg-white shadow">
        {/* Alignment Controls */}
        <div className="flex gap-4 items-center flex-wrap">
          <label className="font-medium">Horizontal:</label>
          <select
            className="border px-2 py-1 rounded"
            value={horizontal}
            onChange={(e) => setHorizontal(e.target.value)}
          >
            <option value="justify-start">Left</option>
            <option value="justify-center">Center</option>
            <option value="justify-end">Right</option>
          </select>

          <label className="font-medium">Vertical:</label>
          <select
            className="border px-2 py-1 rounded"
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
          >
            <option value="items-start">Top</option>
            <option value="items-center">Center</option>
            <option value="items-end">Bottom</option>
          </select>
        </div>

        {/* Size Controls */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium">Box Width (px):</label>
            <input
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={boxWidth}
              onChange={(e) => setBoxWidth(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Box Height (px):</label>
            <input
              type="number"
              className="w-24 border rounded px-2 py-1"
              value={boxHeight}
              onChange={(e) => setBoxHeight(parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Margin Controls */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium">Margin Top:</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={marginTop}
              onChange={(e) => setMarginTop(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Margin Right:</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={marginRight}
              onChange={(e) => setMarginRight(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Margin Bottom:</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={marginBottom}
              onChange={(e) => setMarginBottom(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Margin Left:</label>
            <input
              type="number"
              className="w-20 border rounded px-2 py-1"
              value={marginLeft}
              onChange={(e) => setMarginLeft(parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Live Box Preview */}
      <div className={parentClass}>
        <div className={childClass} style={boxStyle}>
          Child
        </div>
      </div>

      {/* Tailwind Code Output */}
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Parent Tailwind Classes:</label>
          <textarea
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-sm"
            rows={2}
            value={parentClass}
          />
        </div>

        <div>
          <label className="font-semibold">Child Tailwind Classes:</label>
          <textarea
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-sm"
            rows={3}
            value={childTailwindString}
          />
        </div>
      </div>
    </div>
  );
}
