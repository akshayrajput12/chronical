"use client";

import React from "react";
import { motion } from "framer-motion";

interface EventFilterProps {
  filterOptions: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const EventFilter = ({ filterOptions, selectedFilter, onFilterChange }: EventFilterProps) => {
  return (
    <motion.div
      className="mb-8 sm:mb-10 lg:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded hover:scale-105 ${
              selectedFilter === filter
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default EventFilter;
