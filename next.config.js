module.exports = {
  experimental: {
    turbo: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yzrv5nd8tn.ufs.sh",
      },
    ],
  },
  async headers() {
    return [
      {
        // ajout des entêtes à toutes les routes
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)?/",
        headers: [
          {
            key: "x-dns-prefetch-control",
            value: "on",
          },
          {
            key: "strict-transport-security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "x-xss-protection",
            value: "1; mode=block",
          },
          {
            key: "x-frame-options",
            value: "DENY",
          },
          {
            key: "permissions-policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "x-content-type-options",
            value: "nosniff",
          },
          {
            key: "referrer-policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
