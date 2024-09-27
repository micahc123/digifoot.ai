"use client";
import { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export default function DataVisualization() {
  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h2 className="text-white relative z-20 text-3xl">Data Visualization</h2>
    </div>
  );
}

export const Boxes = () => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-r border-slate-700 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              key={`col` + j}
              className={cn(
                "w-16 h-8 border-t border-b border-slate-700 relative",
                j === 0 && "border-l",
                j === cols.length - 1 && "border-r"
              )}
            >
              {/* Colored square that'll be overlayed on top of the grid */}
              <motion.div
                className="absolute inset-0 bg-slate-400 opacity-0"
                animate={{
                  opacity: Math.random() > 0.93 ? 0.3 : 0,
                  transition: { duration: 0.1 },
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};