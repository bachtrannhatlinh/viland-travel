/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal config for fastest build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false, // Disable minification for faster builds
  productionBrowserSourceMaps: false,

  // Disable all experimental features that might cause issues
  experimental: {},

  // No webpack customization to avoid hanging
}

module.exports = nextConfig
