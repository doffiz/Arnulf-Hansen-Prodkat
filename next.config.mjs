/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'www.nordkapp-boats.no', 'res.cloudinary.com', 'res.garmin.com', 'www-static-nw.husqvarna.com', 'images.squarespace-cdn.com', 'pionerboat.no', 'pionerboat.se', 'www.sting-boats.no', 'www.askeladden.no', 'shop.mercurymarine.com', 'cdn.erling-sande.no', 'data.bkhengeren.no', 'www.oienbaat.no', 'marex.no'],
  },
};

export default nextConfig;