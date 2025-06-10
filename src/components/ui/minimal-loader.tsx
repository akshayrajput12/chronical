"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface MinimalLoaderProps {
  isVisible: boolean;
  message?: string;
  size?: "tiny" | "small" | "medium";
  position?: "center" | "top-right" | "bottom-right" | "inline";
  showMessage?: boolean;
}

const MinimalLoader: React.FC<MinimalLoaderProps> = ({ 
  isVisible, 
  message = "Loading...",
  size = "small",
  position = "top-right",
  showMessage = false
}) => {
  // Size configurations
  const sizeConfig = {
    tiny: {
      logo: { width: 32, height: 12 },
      container: "w-12 h-12",
      text: "text-xs",
      padding: "p-2"
    },
    small: {
      logo: { width: 48, height: 18 },
      container: "w-16 h-16",
      text: "text-xs",
      padding: "p-3"
    },
    medium: {
      logo: { width: 64, height: 24 },
      container: "w-20 h-20",
      text: "text-sm",
      padding: "p-4"
    }
  };

  // Position configurations
  const positionConfig = {
    center: "fixed inset-0 flex items-center justify-center z-50",
    "top-right": "fixed top-4 right-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    inline: "flex items-center justify-center"
  };

  const currentSize = sizeConfig[size];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${positionConfig[position]}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div className={`bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 ${currentSize.padding} flex flex-col items-center space-y-2`}>
            {/* Minimal spinning ring around logo */}
            <div className="relative">
              <div className="absolute inset-0 -m-1">
                <div className="w-full h-full border-2 border-transparent border-t-[#a5cd39] rounded-full animate-spin"></div>
              </div>
              
              {/* Logo */}
              <div className="relative z-10">
                <Image
                  src="/logo.png"
                  alt="Chronicle Exhibits"
                  width={currentSize.logo.width}
                  height={currentSize.logo.height}
                  className="h-auto w-auto opacity-90"
                  priority
                />
              </div>
            </div>
            
            {/* Optional message */}
            {showMessage && (
              <motion.p
                className={`${currentSize.text} text-gray-600 font-medium text-center`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {message}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinimalLoader;
