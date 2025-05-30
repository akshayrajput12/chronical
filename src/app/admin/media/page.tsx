'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FolderPlus, 
  Search, 
  Grid, 
  List,
  Image as ImageIcon,
  Video,
  File,
  Trash
} from 'lucide-react';

const MediaLibrary = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Mock media items
  const mediaItems = [
    { id: 1, type: 'image', name: 'hero-background.jpg', size: '2.4 MB', date: '2 hours ago' },
    { id: 2, type: 'video', name: 'hero-video.mp4', size: '12.8 MB', date: '1 day ago' },
    { id: 3, type: 'image', name: 'about-us-banner.jpg', size: '1.7 MB', date: '3 days ago' },
    { id: 4, type: 'image', name: 'team-photo.jpg', size: '3.2 MB', date: '1 week ago' },
    { id: 5, type: 'file', name: 'company-profile.pdf', size: '4.5 MB', date: '2 weeks ago' },
    { id: 6, type: 'image', name: 'service-icon-1.svg', size: '24 KB', date: '3 weeks ago' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Media Library</h1>
          <p className="text-gray-500 mt-1">Manage your images, videos, and files</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <FolderPlus size={16} />
            <span>New Folder</span>
          </button>
          <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#a5cd39] rounded-md text-white hover:bg-[#94b933] transition-colors">
            <Upload size={16} />
            <span>Upload</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a5cd39] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <Grid size={16} />
            <span>Grid</span>
          </button>
          <button className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            <List size={16} />
            <span>List</span>
          </button>
        </div>
      </motion.div>

      {/* Media Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="aspect-square bg-gray-50 relative flex items-center justify-center">
                {item.type === 'image' && (
                  <ImageIcon size={32} className="text-gray-400" />
                )}
                {item.type === 'video' && (
                  <Video size={32} className="text-gray-400" />
                )}
                {item.type === 'file' && (
                  <File size={32} className="text-gray-400" />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-1 bg-white rounded-full text-red-500">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{item.size}</span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaLibrary;
