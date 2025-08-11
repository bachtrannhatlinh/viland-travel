/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'gosafe.vn'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  trailingSlash: false,
  poweredByHeader: false,
  
  // Simple performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
    webpackBuildWorker: true,
  },
  
  // Enable compression
  compress: true,
  
  // Simple webpack optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Simple chunk splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
