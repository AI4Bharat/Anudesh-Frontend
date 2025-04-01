// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const nextConfig = {
  output: "export",
  images: { unoptimized: true },

  webpack: (config, { isServer }) => {
    // Enable gzip compression
    config.plugins.push(new CompressionPlugin());

    // Optimize JavaScript & CSS
    config.optimization = {
      ...config.optimization,
      minimize: true,
      mergeDuplicateChunks: true,
      moduleIds: "deterministic",
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Removes console logs
              dead_code: true, // Removes unused code (Tree Shaking)
              reduce_vars: true, // Optimizes variable references
              passes: 3, // Applies multiple optimizations
              unsafe: true, // Enables more aggressive optimizations
              hoist_funs: true, // Moves function declarations to the top
              hoist_vars: true, // Moves variable declarations to the top
            },
            output: {
              comments: false, // Removes comments in production
            },
          },
          parallel: true, // Enables multi-threading
          extractComments: false, // Prevents separate comment files
        }),
        new CssMinimizerPlugin(), // Minifies CSS
      ],
    };

    // Enable better chunking
    (config.optimization.splitChunks = {
      chunks: "all",
      minSize: 30 * 1024, // 30 KB minimum chunk size
      maxSize: 250 * 1024, // 250 KB max chunk size
      maxInitialRequests: 10, // Allow more parallel requests
    }),
      {
        runtimeChunk: "single", // Extract runtime for better caching
      };
    return config;
  },
};

// module.exports = withBundleAnalyzer(nextConfig);

module.exports = nextConfig;
