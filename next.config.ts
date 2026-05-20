import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/__clerk/:path*',
        destination: 'https://frontend-api.clerk.services/:path*',
      },
    ];
  },
};

export default nextConfig;
