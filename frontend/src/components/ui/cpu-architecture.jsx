import { cn } from "@/lib/utils";
import React from "react";

const CpuArchitecture = ({
  className,
  width = "100%",
  height = "100%",
  text = "R-IT",
  showCpuConnections = true,
  animateText = true,
}) => {
  return (
    <svg
      className={cn("text-muted", className)}
      width={width}
      height={height}
      // viewBox="0 0 200 100" // Original
      // Chip is at x=85, y=40, width=30, height=20.
      // Pins stick out about 10 units in each direction.
      viewBox="70 25 60 50">
      
      {/* CPU Box */}
      <g>
        {/* Cpu connections (Pins) */}
        {showCpuConnections && (
          <g fill="url(#cpu-connection-gradient)">
            {/* Top pins */}
            <rect x="92" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="100" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="108" y="37" width="2.5" height="5" rx="0.7" />
            <rect x="116" y="37" width="2.5" height="5" rx="0.7" />
            
            {/* Bottom pins */}
            <rect x="92" y="58" width="2.5" height="5" rx="0.7" />
            <rect x="100" y="58" width="2.5" height="5" rx="0.7" />
            <rect x="108" y="58" width="2.5" height="5" rx="0.7" />
            <rect x="116" y="58" width="2.5" height="5" rx="0.7" />

            {/* Left pins */}
            <rect x="82" y="45" width="5" height="2.5" rx="0.7" />
            <rect x="82" y="52.5" width="5" height="2.5" rx="0.7" />

            {/* Right pins */}
            <rect x="128" y="45" width="5" height="2.5" rx="0.7" />
            <rect x="128" y="52.5" width="5" height="2.5" rx="0.7" />
          </g>
        )}
        {/* Main CPU Rectangle */}
        <rect
          x="85"
          y="40"
          width="45"
          height="20"
          rx="2"
          fill="#181818"
          filter="url(#cpu-light-shadow)" />
        {/* CPU Text */}
        <text
          x="107.5"
          y="52.5"
          fontSize="7.5"
          textAnchor="middle"
          fill={animateText ? "url(#cpu-text-gradient)" : "white"}
          fontWeight="600"
          letterSpacing="0.05em">
          {text}
        </text>
      </g>
      
      <defs>
        <filter id="cpu-light-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1.5" dy="1.5" stdDeviation="1" floodColor="black" floodOpacity="0.3" />
        </filter>
        {/* Cpu connection gradient */}
        <linearGradient id="cpu-connection-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#888888" />
          <stop offset="100%" stopColor="#333333" />
        </linearGradient>
        {/* Add CPU Text Gradient */}
        <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa">
            <animate
              attributeName="offset"
              values="-2; -1; 0"
              dur="3s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="25%" stopColor="white">
            <animate
              attributeName="offset"
              values="-1; 0; 1"
              dur="3s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="50%" stopColor="#60a5fa">
            <animate
              attributeName="offset"
              values="0; 1; 2;"
              dur="3s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.5; 1"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export { CpuArchitecture };
