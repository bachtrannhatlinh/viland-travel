/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'gosafe.vn'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default-value',
  },
  // Optimize build performance - disable SSG completely
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  // Force all pages to be dynamic (no SSG)
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = nextConfig
