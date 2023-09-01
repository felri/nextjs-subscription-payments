/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kegfmgglwqigzhuyjquo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  }
};

module.exports = nextConfig;
