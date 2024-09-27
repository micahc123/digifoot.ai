// components/ClientMetrics.js
'use client';

import React from 'react';

export default function ClientMetrics() {
  return (
    <>
      {['Posts', 'Likes', 'Comments', 'Shares'].map(metric => (
        <div key={metric} className="bg-background p-4 rounded-lg">
          <h3 className="text-lg font-semibold">{metric}</h3>
          <p className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 1000)}</p>
        </div>
      ))}
    </>
  );
}