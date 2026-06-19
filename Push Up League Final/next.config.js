/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);
const basePath = isProd && !isVercel ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(isProd ? { output: 'export' } : {}),
  basePath,
  assetPrefix: isProd && basePath ? basePath : undefined,
  env: {
    NEXT_PUBLIC_RESOLVED_BASE_PATH: basePath,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
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
