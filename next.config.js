/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The former standalone workspaces now live inside the one NairobiX Portal.
  // Old links keep working, but they only redirect — authorization happens
  // inside /portal (lib/access/server.ts), never at these paths.
  async redirects() {
    const legacy = [
      ['client', 'client'],
      ['staff', 'staff'],
      // "Partner" was renamed to Opportunity Network Participant.
      ['partner', 'participant'],
    ];
    return [
      ...legacy.flatMap(([from, to]) => [
        { source: `/${from}`, destination: `/portal/${to}`, permanent: false },
        { source: `/${from}/:path*`, destination: `/portal/${to}/:path*`, permanent: false },
      ]),
      { source: '/portal/partner', destination: '/portal/participant', permanent: false },
      { source: '/portal/partner/:path*', destination: '/portal/participant/:path*', permanent: false },
    ];
  },
};

module.exports = nextConfig;
