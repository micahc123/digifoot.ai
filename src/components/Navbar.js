"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isDashboard) {
      setIsVisible(true);
    }
  }, [isDashboard]);

  const handleMouseMove = (e) => {
    if (isDashboard) {
      setIsVisible(e.clientY < 60);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDashboard]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 py-3">
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            className={`max-w-5xl mx-auto rounded-full transition-all duration-300 ${
              isScrolled ? 'bg-background/60 backdrop-blur-sm shadow-sm' : 'bg-transparent'
            }`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-6 py-2">
              <Link href="/" className="text-xl font-semibold text-primary hover:text-secondary transition-colors">
                digifoot.ai
              </Link>
              <Link href="/dashboard">
                <motion.button 
                  className="px-4 py-1 rounded-full bg-primary/80 text-white hover:bg-primary transition-all duration-300 text-sm font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}