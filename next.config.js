/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://rpwuxmevphjlnuyzvbfq.supabase.co',
      },
    ],
  },
};

export default nextConfig;