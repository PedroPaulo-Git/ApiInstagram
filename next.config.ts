/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

module.exports = nextConfig;
