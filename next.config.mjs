/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'cdn.erling-sande.no', 'data.bkhengeren.no'],
  },
};

export default nextConfig;