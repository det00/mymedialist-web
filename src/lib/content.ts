// src/lib/content.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";

export interface ContentDetail {
  id_api: string;
  imagen?: string | null;
  titulo: string;
  descripcion: string;
  genero?: string[];
  autor?: string;
  paginas?: number;
  fechaLanzamiento?: string;
  duracion?: string;
  temporadas?: number;
  episodios?: number;
  valoracion?: number;
  tipo: string;
  item?: {  
    id: string;
    estado: string;
  };
  amigos: {
    id: string;
    estado: string;
    imagen_id?: string;
    progreso?: string;
  }[];
}

export const contentService = {
  /**
   * Obtener detalles de una película
   * @param id_api ID de la película en la API externa
   * @returns Promesa con los detalles de la película
   */
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

  /**
   * Obtener detalles de una serie
   * @param id_api ID de la serie en la API externa
   * @returns Promesa con los detalles de la serie
   */
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

  /**
   * Obtener detalles de un libro
   * @param id_api ID del libro en la API externa
   * @returns Promesa con los detalles del libro
   */
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

  /**
   * Obtener detalles de un videojuego
   * @param id_api ID del videojuego en la API externa
   * @returns Promesa con los detalles del videojuego
   */
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

  /**
   * Obtener detalles de cualquier tipo de contenido
   * @param tipo Tipo de contenido (pelicula, serie, libro, videojuego)
   * @param id_api ID en la API externa
   * @returns Promesa con los detalles del contenido
   */
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