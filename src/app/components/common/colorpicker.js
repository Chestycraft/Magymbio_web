"use client";

import { useState } from "react";

export default function ColorAdjuster() {
  const [color, setColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(1);
  const [glass, setGlass] = useState(false);
  const [blur, setBlur] = useState(10);
  const [border, setBorder] = useState(1);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [borderOpacity, setBorderOpacity] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [boxWidth, setBoxWidth] = useState(384); // Initial width (px)
  const [boxHeight, setBoxHeight] = useState(384); // Initial height (px)

  // Dynamically reflect exact size
  const sizeClasses = `rounded-xl w-[${boxWidth}px] h-[${boxHeight}px]`;

  const effectClasses = [
    `bg-[${color}]/[${opacity}]`,
    glass ? `backdrop-blur-[${blur}px]` : "",
    glass && border > 0
      ? `border-[${border}px] border-[${borderColor}]/[${borderOpacity}]`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
    color.slice(3, 5),
    16
  )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;

  const rgbaBorderColor = `rgba(${parseInt(borderColor.slice(1, 3), 16)}, ${parseInt(
    borderColor.slice(3, 5),
    16
  )}, ${parseInt(borderColor.slice(5, 7), 16)}, ${borderOpacity})`;

  const containerStyle = {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: `${boxWidth}px`,
    height: `${boxHeight}px`,
    resize: "both",
    overflow: "auto",
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold">Tailwind Color Adjuster</h1>

      <div className="flex items-center space-x-4 flex-wrap">
        <label className="text-sm">Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label className="text-sm">Opacity:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />

        <label className="text-sm">Glassmorphism:</label>
        <input
          type="checkbox"
          checked={glass}
          onChange={(e) => setGlass(e.target.checked)}
        />
      </div>

      {glass && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Blur:</label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm">Border:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={border}
              onChange={(e) => setBorder(parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm">Border Color:</label>
            <input
              type="color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm">Border Opacity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <label className="text-sm">Background Image URL:</label>
        <input
          type="text"
          className="border px-2 py-1 rounded"
          placeholder="https://example.com/bg.jpg"
          value={backgroundImage}
          onChange={(e) => setBackgroundImage(e.target.value)}
        />
      </div>

      <div
        className="border rounded shadow-lg"
        style={containerStyle}
        onMouseUp={() => {
          // After resize, update the state to reflect new size
          const box = document.getElementById("preview-box");
          if (box) {
            setBoxWidth(box.clientWidth);
            setBoxHeight(box.clientHeight);
          }
        }}
      >
        <div
          id="preview-box"
          className={`${effectClasses} ${sizeClasses}`}
          style={{
            backdropFilter: glass ? `blur(${blur}px)` : "none",
            WebkitBackdropFilter: glass ? `blur(${blur}px)` : "none",
            backgroundColor: rgbaColor,
            border: glass && border > 0 ? `${border}px solid ${rgbaBorderColor}` : "none",
            width: "100%",
            height: "100%",
          }}
        ></div>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <h2 className="text-sm font-semibold">Tailwind Size Classes:</h2>
          <code className="block p-2 bg-gray-100 text-sm whitespace-pre-wrap break-words">
            {sizeClasses}
          </code>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Tailwind Glassmorphism & Effects:</h2>
          <code className="block p-2 bg-gray-100 text-sm whitespace-pre-wrap break-words">
            {effectClasses}
          </code>
        </div>
      </div>
    </div>
  );
}
