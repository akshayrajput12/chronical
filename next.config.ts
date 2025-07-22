import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    rewrites: async () => {
        return [
            {
                source: "/exhibition-stand-builder-:city",
                destination: "/experience-middle-east/:city",
            },
        ];
    },
};

export default nextConfig;
