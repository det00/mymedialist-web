// src/lib/search.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";

export interface SearchResult {
  id_api: string;
  tipo: string;
  imagen: string | null;
  titulo: string;
  descripcion?: string;
  genero?: string[];
  creador?: string;
  autor?: string;
  fechaLanzamiento?: string;
  numAmigos?: number;
  item?: {
    id: string;
    estado: string;
  };
}

/**
 * Servicios para búsqueda de contenido
 */
export const searchService = {
  /**
   * Buscar contenido según tipo y término de búsqueda
   * @param busqueda Término de búsqueda
   * @param tipo Tipo de contenido (P=Película, S=Serie, L=Libro, V=Videojuego)
   * @returns Promesa con los resultados de búsqueda
   */
  async searchContent(busqueda: string, tipo: string): Promise<SearchResult[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<SearchResult[]>("/buscar", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          busqueda,
          tipo
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error en búsqueda de contenido:", error);
      return [];
    }
  }
};

export default searchService;