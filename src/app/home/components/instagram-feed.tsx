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
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  // State for Instagram feed data
  const [sectionData, setSectionData] = useState<InstagramFeedSection | null>(null);
  const [posts, setPosts] = useState<InstagramPostType[]>([]);
  const [loading, setLoading] = useState(true);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeftDesktop, setCanScrollLeftDesktop] = useState(false);
  const [canScrollRightDesktop, setCanScrollRightDesktop] = useState(true);

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

  // Scroll functions for desktop carousel
  const scrollLeftDesktop = () => {
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRightDesktop = () => {
    if (desktopScrollRef.current) {
      desktopScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Check scroll position to enable/disable buttons
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Check scroll position for desktop carousel
  const checkScrollDesktop = () => {
    if (desktopScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = desktopScrollRef.current;
      setCanScrollLeftDesktop(scrollLeft > 0);
      setCanScrollRightDesktop(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const desktopScrollElement = desktopScrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      checkScroll(); // Initial check
    }

    if (desktopScrollElement) {
      desktopScrollElement.addEventListener('scroll', checkScrollDesktop);
      checkScrollDesktop(); // Initial check
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
      if (desktopScrollElement) {
        desktopScrollElement.removeEventListener('scroll', checkScrollDesktop);
      }
    };
  }, [posts]);

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

          <div className="hidden md:flex gap-4 max-w-6xl mx-auto overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex-shrink-0 w-[300px]">
                <div className="w-full h-[240px] bg-gray-200"></div>
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

        {/* Desktop View - Carousel */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            ref={desktopScrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 pb-4">
              {displayPosts.map((post) => (
                <div key={post.id} className="snap-center flex-shrink-0 w-[300px]">
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
        </div>

        {/* Desktop Navigation Arrows - Outside the carousel */}
        <div className="relative hidden md:block max-w-6xl mx-auto">
          {canScrollLeftDesktop && (
            <button
              onClick={scrollLeftDesktop}
              className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg z-10 transition-all hover:bg-white hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          )}
          {canScrollRightDesktop && (
            <button
              onClick={scrollRightDesktop}
              className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-3 shadow-lg z-10 transition-all hover:bg-white hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          )}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden">
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
        </div>

        {/* Mobile Navigation Arrows - Outside the carousel */}
        <div className="relative md:hidden">
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg z-10 transition-all hover:bg-white hover:shadow-xl"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg z-10 transition-all hover:bg-white hover:shadow-xl"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// Instagram Card Component
const InstagramCard = ({ post }: InstagramCardProps) => {
  const hasRedirectUrl = post.redirect_url && post.redirect_url.trim() !== '';

  const cardContent = (
    <div className="relative overflow-hidden shadow-md group h-[240px] hover:-translate-y-1 transition-transform duration-200">
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
