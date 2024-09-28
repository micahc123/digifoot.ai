"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 80%)`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
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

const FeatureCard = ({ title, description, icon }) => {
  return (
    <motion.div
      className="bg-surface p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

const ParallaxSection = ({ children }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <motion.div
      style={{ y }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-text overflow-x-hidden">
      <SpotlightBackground />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4">
        <CoverComponent>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="text-gradient py-4 text-center text-4xl font-medium tracking-tight md:text-7xl"
          >
            <TypewriterText text="Discover Your Digital Footprint" />
          </motion.h1>
        </CoverComponent>
        <div className="flex flex-col sm:flex-row items-center justify-center mt-10 z-10 space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/dashboard">
            <motion.button 
              className="px-6 py-3 rounded-full bg-primary text-text hover:bg-secondary transition-colors duration-300 text-lg font-semibold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Get Started
            </motion.button>
          </Link>
          <Link href="/demo" className="group">
            <motion.span 
              className="text-text group-hover:text-primary transition-colors duration-300 text-lg font-semibold flex items-center"
              whileHover={{ x: 5 }}
            >
              Watch Demo 
              <svg 
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.span>
          </Link>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg className="w-6 h-6 text-text" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </section>

      {/* AI Chat Preview Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Chat with AI About Your Digital Presence</h2>
          <div className="bg-background p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-text rounded-full p-2">AI</div>
                <div className="ml-3 bg-surface p-3 rounded-lg">
                  <p>Based on your social media activity, it seems you're quite interested in technology and AI. Would you like to know more about how this affects your digital footprint?</p>
                </div>
              </div>
              <div className="flex items-start justify-end">
                <div className="mr-3 bg-primary p-3 rounded-lg">
                  <p>Yes, I'd love to know more about that!</p>
                </div>
                <div className="flex-shrink-0 bg-text text-background rounded-full p-2">You</div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-primary text-text rounded-full p-2">AI</div>
                <div className="ml-3 bg-surface p-3 rounded-lg">
                  <p>Great! Your interest in technology and AI is reflected in your frequent interactions with tech-related content. This shapes your digital identity as someone who's tech-savvy and forward-thinking. It could attract opportunities in these fields but also means your data might be more valuable to tech companies. Would you like tips on managing this aspect of your digital footprint?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Explore Your Digital Footprint?</h2>
          <p className="mb-8 text-xl">Gain valuable insights and take control of your online presence today.</p>
          <Link href="/dashboard">
            <motion.button 
              className="px-8 py-4 rounded-full bg-primary text-text hover:bg-secondary transition-colors duration-300 text-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}