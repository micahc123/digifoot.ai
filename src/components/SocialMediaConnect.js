"use client"


import { useState } from 'react';

export default function SocialMediaConnect() {
  const [hoveredPlatform, setHoveredPlatform] = useState(null);
  const platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'];

  return (
    <div className="glass-effect rounded-lg p-8 animate-float">
      <h2 className="text-3xl font-bold mb-6 text-gradient">Connect Your Accounts</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform}
            className="relative overflow-hidden bg-surface text-text font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-accent hover:text-background"
            onMouseEnter={() => setHoveredPlatform(platform)}
            onMouseLeave={() => setHoveredPlatform(null)}
          >
            <span className="relative z-10">{platform}</span>
            <div 
              className={`absolute inset-0 bg-accent transform ${
                hoveredPlatform === platform ? 'scale-100' : 'scale-0'
              } transition-transform duration-300 origin-center`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}