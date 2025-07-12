import React from "react";
import Image from "next/image";
import { AboutDedicationItemData } from "@/types/about";
import { getImageUrlForBucket } from "@/utils/image-url";

interface DedicationSectionServerProps {
    dedicationSectionData: any | null; // Using any for now since the service returns any
}

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, image }) => {
    return (
        <div className="flex flex-col h-full group border border-transparent hover:border-[#a5cd39] p-3 rounded-sm transition-all duration-300">
            {/* Image */}
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden mb-3 rounded-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                {image && image.trim() !== '' ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-0">
                <h3 className="text-base font-markazi !font-bold mb-2 text-[#a5cd39]">
                    {title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed font-nunito">
                    {description}
                </p>
            </div>
        </div>
    );
};

const DedicationSectionServer = ({ dedicationSectionData }: DedicationSectionServerProps) => {
    // Return null if no data is provided or section is not active
    if (!dedicationSectionData || !dedicationSectionData.is_active) {
        return null;
    }

    const sectionData = dedicationSectionData;
    const items = dedicationSectionData.items || [];

    return (
        <section className="py-8 md:py-12 lg:py-16" style={{ backgroundColor: sectionData.background_color || "#f9f7f7" }}>
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Main description text */}
                    <div className="text-center mb-6">
                        <p className="text-gray-700 leading-relaxed mb-8 text-center max-w-4xl mx-auto text-sm leading-[24px]">
                            {sectionData.section_description}
                        </p>

                        <h2 className="text-3xl md:text-4xl font-rubik font-bold mb-2">
                            {sectionData.section_heading}
                        </h2>
                        <div className="flex justify-center">
                            <div className="h-1 bg-[#a5cd39] w-16 mt-2 mb-6"></div>
                        </div>
                    </div>

                    {/* Services grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {items.map((item: AboutDedicationItemData, index: number) => {
                            // Construct proper image URL using the about-dedication bucket
                            const imageUrl = getImageUrlForBucket.aboutDedication(item.image_url);

                            return (
                                <FeatureCard
                                    key={`dedication-${index}-${item.title.slice(0, 10)}`}
                                    title={item.title}
                                    description={item.description}
                                    image={imageUrl}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DedicationSectionServer;
