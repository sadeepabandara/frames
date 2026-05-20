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
      {
        source: '/npm/@clerk/:path*',
        destination: 'https://npm.clerk.services/@clerk/:path*',
      },
    ];
  },
};

export default nextConfig;
