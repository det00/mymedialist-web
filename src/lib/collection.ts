// src/lib/collection.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { CollectionFilter, Contenido } from "@/lib/types";


export const collectionService = {

  async getUserCollection(filters?: CollectionFilter): Promise<Contenido[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      try {
        let combinedResults: Contenido[] = [];
        
        const enProgresoResponse = await api.get("/home/current", {
          headers: { Authorization: `Bearer ${token}` }
        });
        combinedResults = [...combinedResults, ...enProgresoResponse.data];
        
        const pendientesResponse = await api.get("/home/watchlist", {
          headers: { Authorization: `Bearer ${token}` }
        });
        combinedResults = [...combinedResults, ...pendientesResponse.data];
        
        if (filters?.tipo && filters.tipo !== "todo") {
          const tipoMayuscula = filters.tipo.charAt(0).toUpperCase();
          combinedResults = combinedResults.filter(item => 
            item.tipo && item.tipo.charAt(0).toUpperCase() === tipoMayuscula
          );
        }
        
        if (filters?.estado && filters.estado !== "todo") {
          combinedResults = combinedResults.filter(item => 
            item.estado === filters.estado
          );
        }
        
        if (filters?.ordenar) {
          combinedResults = sortCollection(combinedResults, filters.ordenar);
        }
        
        return combinedResults;
      } catch (error) {
        console.warn("Error al obtener desde API, usando datos locales:", error);

      }
    } catch (error) {
      console.error("Error al obtener colección:", error);
    }
      return []
  },

  async addToCollection(id_api: string, tipo: string, estado: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Este endpoint sí existe en el backend
      const response = await api.post("/estado", {
        id_api,
        tipo,
        estado
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al añadir a la colección:", error);
      throw error;
    }
  },

  async updateItem(id: string, estado: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      try {
        const response = await api.put(`/user-items/${id}`, {
          estado
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        return response.data;
      } catch (innerError) {
        console.warn("Error con el endpoint de actualización, usando endpoint alternativo:", innerError);
        
        const item = await this.getItemById(id);
        if (item && item.id_api && item.tipo) {
          return this.addToCollection(item.id_api, item.tipo, estado);
        } else {
          throw new Error("No se pudo obtener información del ítem para actualizarlo");
        }
      }
    } catch (error) {
      console.error("Error al actualizar elemento:", error);
      throw error;
    }
  },

  async removeFromCollection(id: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.delete(`/user-items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al eliminar de la colección:", error);
      throw error;
    }
  },

  async getItemById(id: string): Promise<Contenido | null> {
    try {
      const collection = await this.getUserCollection();
      return collection.find(item => item.id === id) || null;
    } catch (error) {
      console.error("Error al buscar elemento por ID:", error);
      return null;
    }
  },

  async getCollectionStats(): Promise<{
    total: number;
    byStatus: {
      C: number;
      E: number;
      P: number;
      A: number;
    };
    byType: {
      P: number;
      S: number;
      L: number;
      V: number;
    };
  }> {
    try {
      const collection = await this.getUserCollection();
      const stats = {
        total: collection.length,
        byStatus: {
          C: 0,
          E: 0,
          P: 0,
          A: 0
        },
        byType: {
          P: 0,
          S: 0,
          L: 0,
          V: 0
        }
      };
      
      collection.forEach(item => {
        if (item.estado) {
          if (stats.byStatus[item.estado as keyof typeof stats.byStatus] !== undefined) {
            stats.byStatus[item.estado as keyof typeof stats.byStatus]++;
          }
        }
        
        if (item.tipo) {
          const tipoMayuscula = item.tipo.charAt(0).toUpperCase() as 'P' | 'S' | 'L' | 'V';
          if (stats.byType[tipoMayuscula as keyof typeof stats.byType] !== undefined) {
            stats.byType[tipoMayuscula as keyof typeof stats.byType]++;
          }
        }
      });
      
      return stats;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return {
        total: 0,
        byStatus: { C: 0, E: 0, P: 0, A: 0 },
        byType: { P: 0, S: 0, L: 0, V: 0 }
      };
    }
  }
};

function sortCollection(collection: Contenido[], sortBy: string): Contenido[] {
  switch (sortBy) {
    case "title_asc":
      return [...collection].sort((a, b) => a.titulo.localeCompare(b.titulo));
    case "title_desc":
      return [...collection].sort((a, b) => b.titulo.localeCompare(a.titulo));
    case "date_desc":
      return [...collection].sort((a, b) => {
        const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
        const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
        return parseInt(yearB) - parseInt(yearA);
      });
    case "date_asc":
      return [...collection].sort((a, b) => {
        const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
        const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
        return parseInt(yearA) - parseInt(yearB);
      });
    case "rating_desc":
      return [...collection].sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    default:
      return collection;
  }
}

export default collectionService;