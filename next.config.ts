import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i.scdn.co' }, // Spotify
      { protocol: 'https', hostname: 'th.bing.com' }, // Bing Images (IA/Games)
      { protocol: 'https', hostname: 'media.rawg.io' }, // RAWG API
    ],
  },
};

export default nextConfig;
