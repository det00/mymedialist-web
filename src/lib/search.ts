// src/lib/search.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { SearchResult } from "./types";

export const searchService = {
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