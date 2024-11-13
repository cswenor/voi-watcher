/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
    images: {
      domains: [],
    }
  }
  
  module.exports = nextConfig