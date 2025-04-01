import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "image.tmdb.org", 
            "books.google.com", 
            "media.rawg.io"
        ], // Agrega el dominio aquí
    },
};

export default nextConfig;
