import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.mapbox.com",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
      },
      {
        protocol: "https",
        hostname: "staging.ccsa.dev-vizzuality.com",
      },
      {
        protocol: "https",
        hostname: "map.caribbeanaccelerator.org",
      },
    ],
  },
  webpack: (config) => {
    // Fixes warning Critical dependency: the request of a dependency is an expression
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
