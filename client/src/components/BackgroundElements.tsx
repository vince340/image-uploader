import React from 'react';

export default function BackgroundElements() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Floating purple circles */}
      <div className="absolute top-1/4 left-1/5 w-32 h-32 rounded-full bg-purple-400/10 floating" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-2/3 left-1/4 w-20 h-20 rounded-full bg-purple-300/10 floating" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-36 h-36 rounded-full bg-purple-200/10 floating" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/5 right-1/5 w-24 h-24 rounded-full bg-purple-500/10 floating" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Floating gradient blobs with more vibrant colors */}
      <div 
        className="absolute -top-20 -left-20 w-64 h-64 opacity-20 floating" 
        style={{ 
          background: 'radial-gradient(circle, rgba(150, 100, 255, 0.6) 0%, rgba(150, 100, 255, 0) 70%)',
          animationDelay: '0.5s', 
          animationDuration: '8s' 
        }}
      ></div>
      <div 
        className="absolute top-1/2 -right-32 w-96 h-96 opacity-20 floating" 
        style={{ 
          background: 'radial-gradient(circle, rgba(180, 120, 255, 0.5) 0%, rgba(180, 120, 255, 0) 70%)',
          animationDelay: '1.2s',
          animationDuration: '10s'
        }}
      ></div>
      <div 
        className="absolute -bottom-40 left-1/3 w-80 h-80 opacity-20 floating" 
        style={{ 
          background: 'radial-gradient(circle, rgba(130, 80, 255, 0.4) 0%, rgba(130, 80, 255, 0) 70%)',
          animationDelay: '0.8s',
          animationDuration: '7s'
        }}
      ></div>
      
      {/* Animated grid dots */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `radial-gradient(circle, rgba(140, 90, 250, 0.15) 1px, transparent 1px)`, 
        backgroundSize: '30px 30px',
        backgroundPosition: '0 0',
        animation: 'backgroundShift 60s linear infinite alternate'
      }}></div>
    </div>
  );
}