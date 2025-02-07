/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com', // Permite qualquer subdomínio do Instagram
      },
    ],
  },
};

module.exports = nextConfig;
