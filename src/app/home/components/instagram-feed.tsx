'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { InstagramFeedService } from '@/services/instagram-feed.service';
import { InstagramFeedSection, InstagramPost as InstagramPostType } from '@/types/instagram-feed';

interface InstagramCardProps {
  post: {
    id: string;
    image?: string;
    image_url: string;
    caption: string;
    subcaption?: string | null;
    tag?: string | null;
    redirect_url?: string | null;
  };
}

// Default data for Instagram posts (used as fallback)
const defaultInstagramPosts = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=2070',
    caption: 'DWTC Insider:',
    subcaption: 'Streamlined. Digital.',
    tag: 'Hassle-Free',
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=2070',
    caption: 'WHY HERE?',
    subcaption: '',
    tag: '',
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?q=80&w=1974',
    caption: 'LIFESTYLE',
    subcaption: 'FREE ZONE',
    tag: '',
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070',
    caption: 'POV: Your boss just followed',
    subcaption: 'you on social media',
    tag: '',
  },
];

const InstagramFeed = () => {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // State for Instagram feed data
  const [sectionData, setSectionData] = useState<InstagramFeedSection | null>(null);
  const [posts, setPosts] = useState<InstagramPostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Instagram feed data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching Instagram feed section data...');
        const data = await InstagramFeedService.getInstagramFeedSection();
        if (data) {
          console.log('Instagram feed section data received:', data);
          setSectionData(data);

          console.log('Fetching Instagram posts...');
          const postsData = await InstagramFeedService.getInstagramPosts(data.id);
          console.log('Instagram posts received:', postsData);
          setPosts(postsData);
        } else {
          console.error('No Instagram feed section data found');
        }
      } catch (error) {
        console.error('Error fetching Instagram feed data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Show loading state or fallback to default content
  if (loading) {
    return (
      <section className="py-16 bg-gray-100" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
              <div className="h-1 bg-gray-200 w-24 mx-auto mb-4"></div>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-[240px] bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Use data from database or fallback to default content
  const displayPosts = posts.length > 0 ? posts : defaultInstagramPosts;
  const title = sectionData?.title || 'Follow';
  const subtitle = sectionData?.subtitle || 'for the Latest Updates';
  const instagramHandle = sectionData?.instagram_handle || '@dwtc_freezone';

  return (
    <section className="py-16 bg-gray-100" ref={ref} id="instagram-feed">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-rubik font-bold text-gray-900">
            {title} <span className="text-[#a5cd39]">{instagramHandle}</span> {subtitle}
          </h2>
          <div className="w-16 h-[2px] bg-gray-300 mx-auto mt-4"></div>
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {displayPosts.map((post) => (
            <InstagramCard
              key={post.id}
              post={{
                ...post,
                image: post.image_url
              }}
            />
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="relative md:hidden">
          <div
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            ref={scrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 pb-4">
              {displayPosts.map((post) => (
                <div key={post.id} className="snap-center flex-shrink-0 w-[280px]">
                  <InstagramCard
                    post={{
                      ...post,
                      image: post.image_url
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

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
const InstagramCard = ({ post }: InstagramCardProps) => {
  const hasRedirectUrl = post.redirect_url && post.redirect_url.trim() !== '';

  const cardContent = (
    <div className="relative overflow-hidden rounded-md shadow-md group h-[240px] hover:-translate-y-1 transition-transform duration-200">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10"></div>

      <Image
        src={post.image || post.image_url}
        alt={post.caption}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
        <div className="flex flex-col">
          <h3 className="text-xl font-markazi font-bold leading-tight">{post.caption}</h3>
          {post.subcaption && <p className="text-lg font-nunito leading-tight">{post.subcaption}</p>}
          {post.tag && <p className="text-[#a5cd39] font-nunito mt-1 font-medium">{post.tag}</p>}
          {hasRedirectUrl && (
            <p className="text-white/80 font-nunito text-sm mt-2 underline">Click to learn more</p>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
          <Camera size={20} />
        </div>
      </div>
    </div>
  );

  // Wrap with link if redirect URL exists
  if (hasRedirectUrl) {
    return (
      <a
        href={post.redirect_url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default InstagramFeed;
