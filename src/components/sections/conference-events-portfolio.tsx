"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventsPortfolioImage } from "@/types/events-portfolio";

interface ConferenceEventsPortfolioProps {
  title?: string;
  subtitle?: string;
  showFeaturedOnly?: boolean;
  limit?: number;
  className?: string;
}

const ConferenceEventsPortfolio: React.FC<ConferenceEventsPortfolioProps> = ({
  title = "Check Out Our Latest Conference Portfolio",
  subtitle = "Discover our exceptional work in organizing and managing professional conferences",
  showFeaturedOnly = false,
  limit = 12,
  className = "",
}) => {
  const [images, setImages] = useState<EventsPortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch conference-specific portfolio images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          active_only: 'true',
          event_type: 'conference', // Filter for conference events only
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
          setError(result.error || 'Failed to load conference portfolio images');
        }
      } catch (err) {
        console.error('Error fetching conference portfolio images:', err);
        setError('Failed to load conference portfolio images');
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

  const getImageUrl = (image: EventsPortfolioImage): string => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events-portfolio-images/${image.file_path}`;
  };

  if (loading) {
    return (
      <section className={`py-8 md:py-12 lg:py-16 bg-white ${className}`}>
        <div className="mx-auto px-4">
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
            <span className="ml-4 text-gray-600">Loading conference portfolio...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-8 md:py-12 lg:py-16 bg-white ${className}`}>
        <div className="mx-auto px-4">
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
      <section className={`py-8 md:py-12 lg:py-16 bg-white ${className}`}>
        <div className="mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600">No conference portfolio images available at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">
              To add conference portfolio images:
            </p>
            <ol className="text-sm text-gray-500 mt-2 text-left max-w-md mx-auto space-y-1">
              <li>1. Go to Admin → Conference → Events Portfolio</li>
              <li>2. Click "Add Conference Portfolio"</li>
              <li>3. Upload images and fill in the details</li>
              <li>4. Make sure images are marked as "Active"</li>
            </ol>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 md:py-12 lg:py-16 bg-white ${className}`}>
      <div className="mx-auto px-4">
        {/* Header with green underline similar to portfolio page */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl text-center md:text-4xl font-rubik font-bold mb-2">
            {title}
          </h2>
          <div className="flex justify-center">
            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
          </div>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Portfolio Grid - Card Style Layout matching portfolio page */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {currentImages.map((image, index) => {
            return (
              <motion.div
                key={image.id}
                className="group bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                variants={itemVariants}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getImageUrl(image)}
                    alt={image.alt_text}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Featured badge */}
                  {image.is_featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center">
                      <div className="text-sm font-medium">View Project</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination
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
        )} */}


      </div>
    </section>
  );
};

export default ConferenceEventsPortfolio;
