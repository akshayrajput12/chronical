'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

// Add these interfaces at the top of the file after imports
interface InstagramPost {
  id: number;
  image: string;
  caption: string;
  subcaption?: string;
  tag?: string;
  icon: React.ReactNode;
}

interface InstagramCardProps {
  post: InstagramPost;
  variants: {
    hidden: { y: number; opacity: number };
    visible: { y: number; opacity: number; transition: { duration: number } };
  };
}

// Sample data for Instagram posts
const instagramPosts = [
  {
    id: 1,
    // Using placeholder images that match the design
    // In production, these should be replaced with actual Instagram post images
    image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070',
    caption: 'DWTC Insider:',
    subcaption: 'Streamlined. Digital.',
    tag: 'Hassle-Free',
    icon: <Instagram size={20} />,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070',
    caption: 'WHY HERE?',
    subcaption: '',
    tag: '',
    icon: <Instagram size={20} />,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?q=80&w=1974',
    caption: 'LIFESTYLE',
    subcaption: 'FREE ZONE',
    tag: '',
    icon: <Instagram size={20} />,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070',
    caption: 'POV: Your boss just followed',
    subcaption: 'you on social media',
    tag: '',
    icon: <Instagram size={20} />,
  },
];

const InstagramFeed = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  // Scroll functions for mobile carousel
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gray-100" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Follow <span className="text-[#a5cd39]">@dwtc_freezone</span> for the Latest Updates
          </h2>
          <div className="w-16 h-[2px] bg-gray-300 mx-auto mt-4"></div>
        </motion.div>

        {/* Desktop View - Grid */}
        <motion.div
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {instagramPosts.map((post) => (
            <InstagramCard key={post.id} post={post} variants={itemVariants} />
          ))}
        </motion.div>

        {/* Mobile View - Carousel */}
        <div className="relative md:hidden">
          <motion.div
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 pb-4">
              {instagramPosts.map((post) => (
                <div key={post.id} className="snap-center flex-shrink-0 w-[280px]">
                  <InstagramCard post={post} variants={itemVariants} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

// Instagram Card Component
const InstagramCard = ({ post, variants }: InstagramCardProps) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-md shadow-md group h-[240px]"
      variants={variants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>

      <Image
        src={post.image}
        alt={post.caption}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold leading-tight">{post.caption}</h3>
          {post.subcaption && <p className="text-lg leading-tight">{post.subcaption}</p>}
          {post.tag && <p className="text-[#a5cd39] mt-1 font-medium">{post.tag}</p>}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
          {post.icon}
        </div>
      </div>
    </motion.div>
  );
};

export default InstagramFeed;
