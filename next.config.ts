/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fbcdn.net', // Permite imagens hospedadas nos servidores do Facebook/Instagram
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com', // Se precisar carregar imagens deste também
      },
    ],
  },
  output:"export"
};

module.exports = nextConfig;
