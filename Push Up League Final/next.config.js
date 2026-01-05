/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  basePath: '/Push_Up_League',
  assetPrefix: '/Push_Up_League',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // Skip linting during export builds to avoid missing eslint dependency in CI/Pages
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to proceed even if stray TS files in /public fail type checks
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
