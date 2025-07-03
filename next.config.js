/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'vuceqeajjczcjeqadbqv.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'weyctebrsboqjfkntyfd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
  }
}

module.exports = nextConfig
