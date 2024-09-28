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
      setIsVisible(e.clientY < 100);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDashboard]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-6 py-6">
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            className={`max-w-7xl mx-auto rounded-full backdrop-blur-md transition-all duration-300 ${
              isScrolled ? 'bg-background/80 shadow-lg' : 'bg-transparent'
            }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-between px-12 py-4">
              <Link href="/" className="text-3xl font-bold text-primary hover:text-secondary transition-colors">
                digifoot.ai
              </Link>
              <Link href="/dashboard">
                <motion.button 
                  className="px-8 py-3 rounded-full bg-primary text-white hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg text-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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