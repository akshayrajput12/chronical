
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown} from "lucide-react";

const EventsHero = () => {
  return (
    <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image - Dubai World Trade Centre themed */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-5"></div>
      {/* Main Content */}
      <div className="relative z-10 text-center text-white w-full">
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to<br />
          <span className="block">Dubai World</span>
          <span className="block">Trade Centre</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Dubai&apos;s epicentre for events and business in the heart of the city
        </motion.p>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ y: 5 }}
      >
        <ChevronDown className="w-8 h-8 text-white animate-bounce" />
      </motion.div>
    </section>
  );
};

export default EventsHero;
