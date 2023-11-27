/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ["avatars.githubusercontent.com"]
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
}

module.exports = nextConfig
