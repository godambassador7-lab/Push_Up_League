/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  /**
   * Export static HTML so we can deploy via GitHub Pages.
   * The repo is published at /Push_Up_League so we set a matching basePath/assetPrefix.
   */
  output: 'export',
  trailingSlash: true,
  basePath: '/Push_Up_League',
  assetPrefix: '/Push_Up_League',
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
