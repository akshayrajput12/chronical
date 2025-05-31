"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const DoubleDeckerHero = () => {
  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Double Decker Exhibition Stands"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 uppercase tracking-wide">
                DOUBLE DECKER EXHIBITION STANDS
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
                Make your exhibit stand out and step up with our smartly created Double Decker Exhibition Stands. Engage your visitors with
                our stunning and innovative double-decker booths. Make the most of your space, and do not compromise in design. Impress
                your guests during trade shows and special events by incorporating these.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoubleDeckerHero;
