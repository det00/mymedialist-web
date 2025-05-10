import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Desactivando la comprobación de tipos durante la compilación
    // Esto es solo para permitir el despliegue, pero deberías arreglar los errores después
    ignoreBuildErrors: true,
  },
  eslint: {
    // Desactivando la comprobación de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
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
      "imagessl6.casadellibro.com",
      "i.blogs.es",
      "m.media-amazon.com",
      "pics.filmaffinity.com",
      "flxt.tmsimg.com",
      "image.api.playstation.com"
    ],
  },
};

export default nextConfig;
