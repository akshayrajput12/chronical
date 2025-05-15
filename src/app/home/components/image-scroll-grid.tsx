"use client";

import React from 'react';
import Image from "next/image";

interface ImageScrollGridProps {
  className?: string;
}

const ImageScrollGrid: React.FC<ImageScrollGridProps> = ({ className }) => {
  // References for the three columns
  const column1Ref = React.useRef<HTMLDivElement>(null);
  const column2Ref = React.useRef<HTMLDivElement>(null);
  const column3Ref = React.useRef<HTMLDivElement>(null);

  // Business-themed images from Unsplash - expanded collection
  const column1Images = [
    // Professional business people
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    // Modern office spaces
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    // Business meetings
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  ];

  const column2Images = [
    // Professional women in business
    "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1600878459138-e1123b37cb30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    // Urban business districts
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1462396240927-52058a6a84ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    // Business technology
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  ];

  const column3Images = [
    // Business professionals
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    // Modern architecture
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    "https://images.unsplash.com/photo-1577760258779-e787a1733016?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    // Business collaboration
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  ];

  // Animation setup
  React.useEffect(() => {
    // Function to create the scrolling animation
    const animateScroll = () => {
      // Duplicate the images to create a seamless loop
      if (!column1Ref.current || !column2Ref.current || !column3Ref.current) return;

      // Column 1 - Bottom to Top (like middle grid)
      const column1 = column1Ref.current;
      const column1Height = column1.scrollHeight / 2;
      let column1Position = column1Height;

      // Column 2 - Bottom to Top
      const column2 = column2Ref.current;
      const column2Height = column2.scrollHeight / 2;
      let column2Position = column2Height;

      // Column 3 - Bottom to Top (like middle grid)
      const column3 = column3Ref.current;
      const column3Height = column3.scrollHeight / 2;
      let column3Position = column3Height;

      // Animation speeds (pixels per frame) - adjusted for smoother continuous looping
      const column1Speed = 0.5;
      const column2Speed = 0.6;
      const column3Speed = 0.5;

      // Animation loop
      let animationFrameId: number;

      const animate = () => {
        // Column 1 - Bottom to Top (continuous loop)
        column1Position -= column1Speed;
        if (column1Position <= 0) {
          // Reset position seamlessly
          column1Position = column1Height;
        }
        column1.style.transform = `translateY(-${column1Position}px)`;

        // Column 2 - Bottom to Top
        column2Position -= column2Speed;
        if (column2Position <= 0) {
          // Reset position seamlessly
          column2Position = column2Height;
        }
        column2.style.transform = `translateY(-${column2Position}px)`;

        // Column 3 - Bottom to Top (continuous loop)
        column3Position -= column3Speed;
        if (column3Position <= 0) {
          // Reset position seamlessly
          column3Position = column3Height;
        }
        column3.style.transform = `translateY(-${column3Position}px)`;

        animationFrameId = requestAnimationFrame(animate);
      };

      // Start the animation
      animate();

      // Return cleanup function
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    };

    // Initialize the animation and get the cleanup function
    const cleanupAnimation = animateScroll();

    // Cleanup function
    return () => {
      if (cleanupAnimation) {
        cleanupAnimation();
      }
    };
  }, []);

  return (
    <div className={`grid grid-cols-3 gap-4 h-[500px] overflow-hidden ${className}`}>
      {/* Column 1 - Top to Bottom */}
      <div className="relative overflow-hidden h-full">
        <div className="absolute w-full" ref={column1Ref}>
          {/* Original images */}
          {column1Images.map((src, index) => (
            <div key={`col1-img-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
          {/* Duplicated images for seamless loop */}
          {column1Images.map((src, index) => (
            <div key={`col1-dup-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 2 - Bottom to Top */}
      <div className="relative overflow-hidden h-full">
        <div className="absolute w-full" ref={column2Ref}>
          {/* Original images */}
          {column2Images.map((src, index) => (
            <div key={`col2-img-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
          {/* Duplicated images for seamless loop */}
          {column2Images.map((src, index) => (
            <div key={`col2-dup-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Column 3 - Top to Bottom */}
      <div className="relative overflow-hidden h-full">
        <div className="absolute w-full" ref={column3Ref}>
          {/* Original images */}
          {column3Images.map((src, index) => (
            <div key={`col3-img-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
          {/* Duplicated images for seamless loop */}
          {column3Images.map((src, index) => (
            <div key={`col3-dup-${index}`} className="mb-4 overflow-hidden rounded-md shadow-md h-[200px] transform transition-all duration-500 hover:shadow-xl">
              <Image
                src={src}
                alt={`Business image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-110 hover:brightness-110 filter"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageScrollGrid;
