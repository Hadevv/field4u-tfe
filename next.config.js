module.exports = {
  output: "standalone",
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
};
