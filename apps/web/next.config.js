const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kid-bridge/ui"],
  webpack: (config) => {
    config.resolve.alias["@kid-bridge/ui"] = path.resolve(
      __dirname,
      "../../packages/ui/src"
    );
    return config;
  },
};

module.exports = nextConfig;
