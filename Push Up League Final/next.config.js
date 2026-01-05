/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  /**
   * Export static HTML so we can deploy via GitHub Pages.
   * Deploying to root of repository, no basePath needed.
   */
  output: 'export',
  trailingSlash: true,
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
