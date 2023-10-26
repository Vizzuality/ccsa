import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.mapbox.com"],
  },
  // webpack: (config) => {
  //   // Fixes warning Critical dependency: the request of a dependency is an expression
  //   config.module = {
  //     ...config.module,
  //     exprContextCritical: false,
  //   };

  //   return config;
  // },
};

export default nextConfig;
