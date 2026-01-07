/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(isProd ? { output: 'export' } : {}),
  basePath,
  assetPrefix: isProd && basePath ? basePath : undefined,
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
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid eval-source-map strings that can choke on unexpected characters.
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
