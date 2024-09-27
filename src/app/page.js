"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span>
      {displayText}
      <span className="cursor"></span>
    </span>
  );
};

const SpotlightBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      className="spotlight"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
      }}
    />
  );
};

const CoverComponent = ({ children }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-background"></div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden relative">
      <SpotlightBackground />
      <CoverComponent>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 text-gradient py-4 text-center text-4xl font-medium tracking-tight md:text-7xl"
        >
          <TypewriterText text="Discover Your Digital Footprint" />
        </motion.h1>
      </CoverComponent>
      <div className="flex flex-col items-center justify-center mt-10 z-50">
        <Link href="/dashboard">
          <button className="px-6 py-3 rounded-full bg-primary text-text hover:bg-secondary transition-colors duration-300 text-lg font-semibold">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}