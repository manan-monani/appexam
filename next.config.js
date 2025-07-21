
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable TypeScript checking during development
  typescript: {
    // Ignore TypeScript errors during build for faster development
    ignoreBuildErrors: false,
  },
  // Enable ESLint during development
  eslint: {
    // Ignore ESLint errors during build for faster development
    ignoreDuringBuilds: false,
  },
  // Add any custom Next.js configurations here
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    JUDGE0_URL: process.env.JUDGE0_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
};

module.exports = nextConfig;
