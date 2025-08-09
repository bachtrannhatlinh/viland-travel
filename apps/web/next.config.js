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
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Enable compression
  compress: true,
  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
    }
    return config
  },
}

module.exports = nextConfig
