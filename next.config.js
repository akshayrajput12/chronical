/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable static generation and ISR
    output: "standalone",

    // Configure experimental features for better SSG performance
    experimental: {
        // Enable static generation optimizations
        optimizePackageImports: ["@supabase/supabase-js", "lucide-react"],
        // Reduce memory usage during build
        workerThreads: false,
        cpus: 1,
    },

    // Webpack configuration for memory optimization
    webpack: (config, { dev, isServer }) => {
        // Optimize for memory usage during build
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: "all",
                cacheGroups: {
                    default: {
                        minChunks: 1,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        priority: -10,
                        chunks: "all",
                    },
                },
            };
        }

        // Reduce memory usage
        config.optimization.minimize = true;

        return config;
    },

    // Image optimization configuration
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "vuceqeajjczcjeqadbqv.supabase.co",
            },
            {
                protocol: "https",
                hostname: "weyctebrsboqjfkntyfd.supabase.co",
            },
            {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com",
            },
        ],
        // Optimize images for static generation
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },

    // Configure caching for better performance
    onDemandEntries: {
        // Period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 25 * 1000,
        // Number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 2,
    },

    // Enable compression for better performance
    compress: true,

    // Configure headers for better caching
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                ],
            },
            {
                // Cache static assets
                source: "/images/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    rewrites: async () => {
        return [
            {
                source: "/exhibition-stand-builder-:city",
                destination: "/experience-middle-east/:city",
            },
        ];
    },
};

module.exports = nextConfig;
