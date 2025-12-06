import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for optimal deployment (Vercel/Netlify/Docker)
  output: "standalone",
  typescript: {
    // OBS: Change to true i development to catch type-errors
    ignoreBuildErrors: false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Webpack configuration for GLB/GLTF 3D-modeller
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: "asset/resource",
      generator: {
        filename: "static/models/[name].[hash][ext]",
      },
    });

    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    // Fallback
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "three",
      "gsap",
      "react-hot-toast",
    ],
  },

  // Headers for sequrity
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      // Cache static assets (favicon och images)
      {
        source: "/favicon/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache 3D-modeller
      {
        source: "/models/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache textures
      {
        source: "/textures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
} as const satisfies NextConfig;

export default nextConfig;
