"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Calendar, MapPin, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventsPortfolioImage, EVENT_TYPES } from "@/types/events-portfolio";

interface EventsPortfolioProps {
  title?: string;
  subtitle?: string;
  showFeaturedOnly?: boolean;
  limit?: number;
  className?: string;
}

const EventsPortfolio: React.FC<EventsPortfolioProps> = ({
  title = "Check Out Our Latest Events Portfolio",
  subtitle = "Discover our exceptional work in creating memorable events and exhibitions",
  showFeaturedOnly = false,
  limit = 12,
  className = "",
}) => {
  const [images, setImages] = useState<EventsPortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<EventsPortfolioImage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 6;

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Fetch portfolio images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          active_only: 'true',
          sort_by: 'display_order',
          sort_order: 'asc',
          limit: limit.toString(),
        });

        if (showFeaturedOnly) {
          params.append('featured_only', 'true');
        }

        const response = await fetch(`/api/events-portfolio?${params}`);
        const result = await response.json();

        if (result.success) {
          setImages(result.data.images || []);
        } else {
          setError(result.error || 'Failed to load portfolio images');
        }
      } catch (err) {
        console.error('Error fetching portfolio images:', err);
        setError('Failed to load portfolio images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [showFeaturedOnly, limit]);

  // Pagination
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const currentImages = images.slice(
    currentPage * imagesPerPage,
    (currentPage + 1) * imagesPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getImageUrl = (image: EventsPortfolioImage): string => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-portfolio-images/${image.file_path}`;
  };

  if (loading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5cd39]" />
            <span className="ml-4 text-gray-600">Loading portfolio...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600">No portfolio images available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {currentImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              variants={itemVariants}
              onClick={() => setSelectedImage(image)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={getImageUrl(image)}
                  alt={image.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Featured Badge */}
                {image.is_featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#a5cd39] transition-colors">
                  {image.title}
                </h3>
                
                {image.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {image.description}
                  </p>
                )}

                <div className="space-y-2">
                  {image.event_name && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {image.event_name}
                        {image.event_date && ` - ${formatDate(image.event_date)}`}
                      </span>
                    </div>
                  )}
                  
                  {image.event_location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{image.event_location}</span>
                    </div>
                  )}

                  {image.event_type && (
                    <div className="mt-3">
                      <Badge variant="outline">
                        {EVENT_TYPES[image.event_type as keyof typeof EVENT_TYPES]}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center space-x-4"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentPage ? 'bg-[#a5cd39]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedImage && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedImage.title}</span>
                    {selectedImage.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </DialogTitle>
                  {selectedImage.description && (
                    <DialogDescription>
                      {selectedImage.description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Image */}
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(selectedImage)}
                      alt={selectedImage.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {selectedImage.event_name && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Event</h4>
                          <p className="text-gray-600">{selectedImage.event_name}</p>
                        </div>
                      )}
                      
                      {selectedImage.event_date && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Date</h4>
                          <p className="text-gray-600">{formatDate(selectedImage.event_date)}</p>
                        </div>
                      )}
                      
                      {selectedImage.event_location && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                          <p className="text-gray-600">{selectedImage.event_location}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {selectedImage.event_type && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Event Type</h4>
                          <Badge variant="outline">
                            {EVENT_TYPES[selectedImage.event_type as keyof typeof EVENT_TYPES]}
                          </Badge>
                        </div>
                      )}
                      
                      {selectedImage.tags && selectedImage.tags.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedImage.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {selectedImage.caption && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Caption</h4>
                          <p className="text-gray-600">{selectedImage.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default EventsPortfolio;
