// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const nextConfig = ({
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
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Removes console logs
              dead_code: true, // Removes unused code (Tree Shaking)
              reduce_vars: true, // Optimizes variable references
              passes: 3, // Applies multiple optimizations
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
    config.optimization.splitChunks = {
      chunks: "all",
      minSize: 30 * 1024, // 30 KB minimum chunk size
      maxSize: 250 * 1024, // 250 KB max chunk size
    };

    return config;
  },
});

module.exports = nextConfig;
