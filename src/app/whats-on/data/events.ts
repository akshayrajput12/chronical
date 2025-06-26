export interface Event {
    id: string;
    title: string;
    category: string;
    dateRange: string;
    image: string;
    heroImage: string;
    description: string;
    organizer: string;
    organizedBy: string;
    venue: string;
    eventType: string;
    industry: string;
    audience: string;
    logoImage: string;
    logoText?: string;
    logoSubtext?: string;
}

export const eventsData: Event[] = [
    {
        id: "1",
        title: "Concept Big Brands Carnival - CBBC",
        category: "CONSUMER GOODS",
        dateRange: "24 MAY - 1 JUN 2025",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "The CBBC brand with heritage celebrates deals, showcasing over 200 fashion and luxury brands with discounts of upto 70%.",
        organizer: "EXCELLENT BRANDS LLC",
        organizedBy: "GENERAL TRADING",
        logoImage: "/event-logo.jpg",
        venue: "SHEIKH MAKTOUM HALL",
        eventType: "BRAND SALE",
        industry: "CONSUMER GOODS",
        audience: "PUBLIC",
        logoText: "CBBC",
        logoSubtext: "CONCEPT BIG BRANDS CARNIVAL",
    },
    {
        id: "2",
        title: "Index Exhibition",
        category: "GIFTS AND INTERIORS",
        dateRange: "27 - 29 MAY 2025",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Leading exhibition for interior design and home decoration showcasing the latest trends and innovations in gifts and interiors.",
        organizer: "INDEX EXHIBITIONS",
        organizedBy: "DESIGN TRADING",
        venue: "DUBAI WORLD TRADE CENTRE",
        logoImage: "/event-logo.jpg",
        eventType: "TRADE FAIR",
        industry: "GIFTS AND INTERIORS",
        audience: "TRADE ONLY",
        logoText: "INDEX",
        logoSubtext: "GIFTS AND INTERIORS EXHIBITION",
    },
    {
        id: "3",
        title: "The Hotel Show",
        category: "FOOD, HOTEL AND CATERING",
        dateRange: "27 - 29 MAY 2025",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Premier hospitality trade show featuring the latest in hotel technology, food service, and catering solutions for the hospitality industry.",
        organizer: "HOTEL SHOW ORGANIZERS",
        organizedBy: "HOSPITALITY TRADING",
        logoImage: "/event-logo.jpg",
        venue: "DUBAI WORLD TRADE CENTRE",
        eventType: "TRADE FAIR",
        industry: "FOOD, HOTEL AND CATERING",
        audience: "TRADE ONLY",
        logoText: "HOTEL",
        logoSubtext: "THE HOTEL SHOW",
    },
    {
        id: "4",
        title: "Tech Innovation Summit",
        category: "TECHNOLOGY",
        dateRange: "15 - 17 JUN 2025",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Cutting-edge technology and innovation showcase featuring the latest developments in AI, blockchain, IoT, and emerging technologies.",
        organizer: "TECH SUMMIT ORGANIZERS",
        logoImage: "/event-logo.jpg",
        organizedBy: "INNOVATION TRADING",
        venue: "DUBAI INTERNATIONAL CONVENTION CENTRE",
        eventType: "SUMMIT",
        industry: "TECHNOLOGY",
        audience: "PUBLIC",
        logoText: "TECH",
        logoSubtext: "INNOVATION SUMMIT",
    },
    {
        id: "5",
        title: "Healthcare Expo",
        category: "MEDICAL & HEALTHCARE",
        dateRange: "22 - 24 JUN 2025",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Premier healthcare and medical equipment exhibition showcasing the latest medical technologies, pharmaceuticals, and healthcare solutions.",
        organizer: "HEALTHCARE EXPO LLC",
        organizedBy: "MEDICAL TRADING",
        logoImage: "/event-logo.jpg",
        venue: "DUBAI WORLD TRADE CENTRE",
        eventType: "EXPO",
        industry: "MEDICAL & HEALTHCARE",
        audience: "TRADE ONLY",
        logoText: "HEALTH",
        logoSubtext: "HEALTHCARE EXPO",
    },
    {
        id: "6",
        title: "Sustainable Energy Forum",
        category: "ENERGY & ENVIRONMENT",
        dateRange: "5 - 7 JUL 2025",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Leading sustainable energy and environmental solutions forum featuring renewable energy technologies, green innovations, and sustainability practices.",
        organizer: "GREEN ENERGY FORUM",
        organizedBy: "SUSTAINABLE TRADING",
        venue: "DUBAI INTERNATIONAL CONVENTION CENTRE",
        eventType: "FORUM",
        logoImage: "/event-logo.jpg",
        industry: "ENERGY & ENVIRONMENT",
        audience: "PUBLIC",
        logoText: "GREEN",
        logoSubtext: "SUSTAINABLE ENERGY FORUM",
    },
    {
        id: "7",
        title: "Fashion Week Dubai",
        category: "FASHION & LIFESTYLE",
        dateRange: "12 - 15 JUL 2025",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "Premier fashion event showcasing the latest collections from international and regional designers, featuring runway shows and fashion exhibitions.",
        organizer: "FASHION WEEK ORGANIZERS",
        organizedBy: "FASHION TRADING",
        venue: "DUBAI DESIGN DISTRICT",
        logoImage: "/event-logo.jpg",
        eventType: "FASHION WEEK",
        industry: "FASHION & LIFESTYLE",
        audience: "PUBLIC",
        logoText: "FASHION",
        logoSubtext: "FASHION WEEK DUBAI",
    },
    {
        id: "8",
        title: "Auto Show Dubai",
        category: "AUTOMOTIVE",
        dateRange: "20 - 23 JUL 2025",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        heroImage:
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        description:
            "International automotive exhibition featuring the latest car models, electric vehicles, automotive technologies, and industry innovations.",
        organizer: "AUTO SHOW DUBAI LLC",
        organizedBy: "AUTOMOTIVE TRADING",
        venue: "DUBAI WORLD TRADE CENTRE",
        logoImage: "/event-logo.jpg",
        eventType: "AUTO SHOW",
        industry: "AUTOMOTIVE",
        audience: "PUBLIC",
        logoText: "AUTO",
        logoSubtext: "AUTO SHOW DUBAI",
    },
];

// Helper function to get event by ID
export const getEventById = (id: string): Event | undefined => {
    return eventsData.find(event => event.id === id);
};

// Helper function to get other events (excluding current event)
export const getOtherEvents = (currentEventId: string): Event[] => {
    return eventsData.filter(event => event.id !== currentEventId).slice(0, 5);
};

// Helper function to get all events
export const getAllEvents = (): Event[] => {
    return eventsData;
};
