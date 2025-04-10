import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org", "books.google.com", "media.rawg.io"], // Agrega el dominio aquí
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Las solicitudes a '/api/*' se redirigirán
        destination: "https://my-media-list-backend.fly.dev/:path*", // Redirigir a la URL del backend
      },
    ];
  },
};

export default nextConfig;
