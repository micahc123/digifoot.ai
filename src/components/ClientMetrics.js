// components/ClientMetrics.js
'use client';

import React from 'react';

export default function ClientMetrics({ socialData }) {
  
   // Function to calculate total likes and comments if available
   const calculateMetrics = (data) => {
     let totalPosts = data.length || 0;
     let totalLikes = data.reduce((accum, post) => accum + (post.likes || 0), 0);
     let totalComments = data.reduce((accum, post) => accum + (post.comments || 0), 0);

     return { totalPosts, totalLikes, totalComments };
   };

   const instagramMetrics = calculateMetrics(socialData.Instagram || []);

   return (
     <div className="space-y-4">
       <h2 className="text-2xl font-bold text-gradient">Social Media Metrics</h2>

       {/* Instagram Metrics */}
       {socialData.Instagram && (
         <div className="bg-background p-4 rounded-lg">
           <h3 className="text-lg font-semibold">Instagram Metrics</h3>
           <p>Posts: {instagramMetrics.totalPosts}</p>
           {/* Add likes and comments metrics if available */}
         </div>
       )}

       {/* Other social media metrics can be added here */}
     </div>
   );
}