import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "image.tmdb.org",
      "books.google.com",
      "media.rawg.io",
      "via.placeholder.com",
      "cdn-products.eneba.com",
      "assets.nintendo.com",
      "www.themoviedb.org",
      "images-na.ssl-images-amazon.com",
    ],
  },
};

export default nextConfig;
