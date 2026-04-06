/** @type {import('@/MapBox/node_modules/next').NextConfig} */
const nextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '10.212.186.171:3000',
    '10.212.186.171',
  ],
  async rewrites() {
    return [
      {
        source: '/external-api/:path*',
        destination: 'https://api.bigdatacloud.net*', // Proxy to external
      },
    ];
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
