"use client";

import React from "react";
import Image from "next/image";

interface PortfolioItem {
    id: number;
    src: string;
    alt: string;
    className: string;
}

const portfolioItems: PortfolioItem[] = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop",
        alt: "Modern tech exhibition booth with purple lighting and interactive displays",
        className: "row-span-2",
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop",
        alt: "Colorful triangular booth design with red and blue elements",
        className: "row-span-1",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=500&fit=crop",
        alt: "Professional booth with circular ceiling design and attendees",
        className: "row-span-2",
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop",
        alt: "Wooden and modern booth design with clean lines",
        className: "row-span-2",
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop",
        alt: "Red and white booth with multiple display screens",
        className: "row-span-2",
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        alt: "White minimalist booth with green accents",
        className: "row-span-1",
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
        alt: "Exhibition hall with golden lighting",
        className: "row-span-1",
    },
    {
        id: 8,
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
        alt: "Modern exhibition space with attendees",
        className: "row-span-1",
    },
    {
        id: 9,
        src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=400&fit=crop",
        alt: "Trade show booth with interactive displays",
        className: "row-span-2",
    },
    {
        id: 10,
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop",
        alt: "Corporate exhibition stand",
        className: "row-span-1",
    },
    {
        id: 11,
        src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=500&fit=crop",
        alt: "Large scale exhibition with multiple booths",
        className: "row-span-2",
    },
    {
        id: 12,
        src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop",
        alt: "Professional conference and exhibition setup",
        className: "row-span-1",
    },
];

const PortfolioGallery = () => {
    return (
        <section className="py-8 md:py-12 lg:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Gallery Grid - Masonry Style with Random Sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 auto-rows-[150px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
                        {portfolioItems.map(item => (
                            <div
                                key={item.id}
                                className={`group relative overflow-hidden ${item.className}`}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />

                                {/* VIEW CASE Full Overlay on Hover - Shows on ALL images */}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-rubik font-bold tracking-wider">
                                        VIEW CASE
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortfolioGallery;
