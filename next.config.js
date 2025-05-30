/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'img.clerk.com',
      'vuceqeajjczcjeqadbqv.supabase.co', // Old Supabase URL
      'weyctebrsboqjfkntyfd.supabase.co', // New Supabase URL
    ],
  }
}

module.exports = nextConfig
