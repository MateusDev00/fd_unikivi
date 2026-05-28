/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rpwuxmevphjlnuyzvbfq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/imagens/**',
        search: '',   // obrigatório para versões < 15.3.0
      },
    ],
  },
};

module.exports = nextConfig;