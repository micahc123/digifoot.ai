import { useState } from 'react';

export default function AccountStatistics() {
  const [hoveredStat, setHoveredStat] = useState(null);
  const stats = [
    { label: 'Posts', value: 1234 },
    { label: 'Followers', value: 5678 },
    { label: 'Following', value: 910 },
  ];

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gradient">Account Statistics</h3>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="text-center p-4 rounded-lg hover-scale cursor-pointer relative overflow-hidden"
            onMouseEnter={() => setHoveredStat(stat.label)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="relative z-10">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm">{stat.label}</p>
            </div>
            <div 
              className={`absolute inset-0 bg-accent opacity-20 transform ${
                hoveredStat === stat.label ? 'scale-100' : 'scale-0'
              } transition-transform duration-300 origin-center`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}