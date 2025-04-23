// src/lib/content.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { ContentDetail } from "./types";

export const contentService = {
  async getMovieDetails(id_api: string): Promise<ContentDetail> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentDetail>("/pelicula", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          id_api
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles de película:", error);
      throw error;
    }
  },

  async getSeriesDetails(id_api: string): Promise<ContentDetail> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentDetail>("/serie", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          id_api
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles de serie:", error);
      throw error;
    }
  },

  async getBookDetails(id_api: string): Promise<ContentDetail> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentDetail>("/libro", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          id_api
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles de libro:", error);
      throw error;
    }
  },

  async getGameDetails(id_api: string): Promise<ContentDetail> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentDetail>("/videojuego", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          id_api
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles de videojuego:", error);
      throw error;
    }
  },

  async getContentDetails(tipo: string, id_api: string): Promise<ContentDetail> {
    switch (tipo) {
      case "pelicula":
        return this.getMovieDetails(id_api);
      case "serie":
        return this.getSeriesDetails(id_api);
      case "libro":
        return this.getBookDetails(id_api);
      case "videojuego":
        return this.getGameDetails(id_api);
      default:
        throw new Error(`Tipo de contenido no soportado: ${tipo}`);
    }
  }
};

export default contentService;