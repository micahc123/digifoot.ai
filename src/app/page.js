"use client";
import React, { useState, useEffect, useRef } from "react";
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

const DigitalFootprintBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const nodes = [];
    const nodeCount = 50;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 2,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 0.7)`,
        velocity: {
          x: (Math.random() - 0.5) * 1,
          y: (Math.random() - 0.5) * 1
        }
      });
    }

    const drawNodes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, index) => {
        node.x += node.velocity.x;
        node.y += node.velocity.y;

        if (node.x < 0 || node.x > canvas.width) node.velocity.x *= -1;
        if (node.y < 0 || node.y > canvas.height) node.velocity.y *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        ctx.font = '10px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('Data', node.x - 10, node.y - 10);

        nodes.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance / 1500})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });
      });

      animationFrameId = requestAnimationFrame(drawNodes);
    };

    drawNodes();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
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

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-text overflow-x-hidden">
      <DigitalFootprintBackground />
      
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-primary">digifoot.ai</span>
          </h1>
          <h2 className="text-2xl md:text-4xl mb-8">
            <TypewriterText text="Your AI-Powered Digital Footprint Analyzer" />
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Understand and optimize your online presence with cutting-edge AI technology 🚀
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/dashboard">
              <motion.button 
                className="px-8 py-4 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-300 text-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Analyzing
              </motion.button>
            </Link>
            <Link href="https://www.youtube.com/watch?v=bAN3KmTSy2Q" className="group" target="_blank" rel="noopener noreferrer">
              <motion.span 
                className="text-primary group-hover:text-secondary transition-colors duration-300 text-lg font-semibold flex items-center"
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
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="AI-Powered Analysis"
              description="Leverage advanced AI algorithms to analyze your digital footprint across multiple platforms."
              icon="🤖"
            />
            <FeatureCard
              title="Privacy-Focused"
              description="Your data stays yours. We prioritize your privacy and security above all else."
              icon="🔒"
            />
            <FeatureCard
              title="Actionable Insights"
              description="Get personalized recommendations to improve your online presence and protect your digital identity."
              icon="💡"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Digital Footprint?</h2>
          <Link href="/dashboard">
            <motion.button 
              className="px-8 py-4 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-300 text-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started For Free
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}