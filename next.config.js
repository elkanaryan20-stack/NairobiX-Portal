/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The former standalone workspaces now live inside the one NairobiX Portal.
  // Old links keep working, but they only redirect — authorization happens
  // at /portal (middleware.ts), never at these paths.
  async redirects() {
    return ['client', 'partner', 'staff'].flatMap((context) => [
      { source: `/${context}`, destination: `/portal/${context}`, permanent: false },
      { source: `/${context}/:path*`, destination: `/portal/${context}/:path*`, permanent: false },
    ]);
  },
};

module.exports = nextConfig;
