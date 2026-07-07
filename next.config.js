/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.ctfassets.net', 'vumbnail.com'],
  },
  transpilePackages: ['pixi.js', '@pixi/core', '@pixi/display', '@pixi/filter-displacement'],
  async headers() {
    const IMMUTABLE = 'public, max-age=31536000, immutable';
    return [
      { source: '/intro/:path*',   headers: [{ key: 'Cache-Control', value: IMMUTABLE }] },
      { source: '/images/:path*',  headers: [{ key: 'Cache-Control', value: IMMUTABLE }] },
      { source: '/LOGO_Rev.png',   headers: [{ key: 'Cache-Control', value: IMMUTABLE }] },
    ];
  },
};
export default nextConfig;
