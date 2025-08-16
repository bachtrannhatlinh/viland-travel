/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vilandtravel.vn'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  trailingSlash: false,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Performance optimizations - tắt webpackBuildWorker để tránh permission issue
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // webpackBuildWorker: true, // Tạm tắt để tránh lỗi permission
  },

  compress: true,

  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.cache = {
        type: 'memory',
      };
      
      if (!isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
    }
    return config;
  },
}

module.exports = nextConfig
