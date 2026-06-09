/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.ctfassets.net'],
  },
  transpilePackages: ['pixi.js', '@pixi/core', '@pixi/display', '@pixi/filter-displacement'],
};
export default nextConfig;
