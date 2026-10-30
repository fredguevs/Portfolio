import type { NextConfig } from "next";

// Plain static HTML in `out/`, so it can live on GitHub Pages, Netlify, an S3 bucket, wherever.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
