/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'zaukritievents.in',
          },
        ],
        destination: 'https://zaukriti.ai/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.zaukritievents.in',
          },
        ],
        destination: 'https://zaukriti.ai/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
