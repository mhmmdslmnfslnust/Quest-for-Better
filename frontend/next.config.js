/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
      },
    ]
  },
  images: {
    domains: ['localhost'],
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
