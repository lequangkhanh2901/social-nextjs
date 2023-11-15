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
  reactStrictMode: false
}

module.exports = nextConfig
