/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      }
    ]
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  }
}

module.exports = nextConfig
