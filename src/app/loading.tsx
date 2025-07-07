import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Chronicle Exhibits Logo"
          width={180}
          height={60}
          className="mx-auto mb-8"
        />
        
        <div className="relative">
          {/* Animated loading spinner */}
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#a5cd39] rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading text */}
          <p className="text-gray-600 text-lg font-medium">
            Loading...
          </p>
          
          {/* Subtle animation for the dots */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-[#a5cd39] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#a5cd39] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#a5cd39] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
