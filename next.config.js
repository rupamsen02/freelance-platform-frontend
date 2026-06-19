/** @type {import('next').NextConfig} */
// next.config.js

const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8800',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
