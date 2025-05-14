const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yzrv5nd8tn.ufs.sh",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_LINT === "true",
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === "true",
  },
});
