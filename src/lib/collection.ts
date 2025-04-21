// src/lib/collection.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { Contenido } from "@/lib/types";

export interface CollectionFilter {
  tipo?: string;
  estado?: string;
  ordenar?: string;
}

export const collectionService = {
  /**
   * Obtener la colección completa del usuario con filtros opcionales
   * @param filters Filtros para la colección (tipo, estado, ordenación)
   * @returns Promesa con los elementos de la colección
   */
  async getUserCollection(filters?: CollectionFilter): Promise<Contenido[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Construir parámetros de consulta
      const params: Record<string, string> = {};
      if (filters?.tipo && filters.tipo !== "todo") {
        params.tipo = filters.tipo;
      }
      if (filters?.estado && filters.estado !== "todo") {
        params.estado = filters.estado;
      }

      const response = await api.get<Contenido[]>("/coleccion", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      });
      
      // Ordenar los resultados si es necesario
      let results = response.data;
      if (filters?.ordenar) {
        results = sortCollection(results, filters.ordenar);
      }
      
      return results;
    } catch (error) {
      console.error("Error al obtener colección:", error);
      // En caso de error, devolvemos una lista vacía
      return [];
    }
  },

  /**
   * Añadir un elemento a la colección del usuario
   * @param id_api ID del contenido en la API externa
   * @param tipo Tipo de contenido (P, S, L, V)
   * @param estado Estado del contenido (C, E, P, A)
   * @returns Promesa con la respuesta del servidor
   */
  async addToCollection(id_api: string, tipo: string, estado: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.post("/user-items", {
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

  /**
   * Actualizar el estado de un elemento en la colección
   * @param id ID del elemento en la colección
   * @param estado Nuevo estado (C, E, P, A)
   * @returns Promesa con la respuesta del servidor
   */
  async updateItem(id: string, estado: string): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.put(`/user-items/${id}`, {
        estado
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al actualizar elemento:", error);
      throw error;
    }
  },

  /**
   * Eliminar un elemento de la colección
   * @param id ID del elemento en la colección
   * @returns Promesa con la respuesta del servidor
   */
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

  /**
   * Obtener estadísticas de la colección (conteo por tipo y estado)
   * @returns Promesa con las estadísticas de la colección
   */
  async getCollectionStats(): Promise<{
    total: number;
    byStatus: {
      C: number; // Completado
      E: number; // En progreso
      P: number; // Pendiente
      A: number; // Abandonado
    };
    byType: {
      P: number; // Película
      S: number; // Serie
      L: number; // Libro
      V: number; // Videojuego
    };
  }> {
    try {
      // Primero obtenemos toda la colección
      const collection = await this.getUserCollection();
      
      // Calculamos las estadísticas manualmente
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
      
      // Contamos por tipo y estado
      collection.forEach(item => {
        if (item.item?.estado) {
          // @ts-ignore - Sabemos que el estado es una de las claves válidas
          stats.byStatus[item.item.estado]++;
        }
        
        if (item.tipo) {
          const tipoMayuscula = item.tipo.toUpperCase().charAt(0) as 'P' | 'S' | 'L' | 'V';
          // @ts-ignore - Sabemos que el tipo es una de las claves válidas
          stats.byType[tipoMayuscula]++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      // Devolver estadísticas vacías en caso de error
      return {
        total: 0,
        byStatus: { C: 0, E: 0, P: 0, A: 0 },
        byType: { P: 0, S: 0, L: 0, V: 0 }
      };
    }
  }
};

/**
 * Función auxiliar para ordenar la colección
 * @param collection Colección a ordenar
 * @param sortBy Criterio de ordenación
 * @returns Colección ordenada
 */
function sortCollection(collection: Contenido[], sortBy: string): Contenido[] {
  switch (sortBy) {
    case "title_asc":
      return [...collection].sort((a, b) => a.titulo.localeCompare(b.titulo));
    case "title_desc":
      return [...collection].sort((a, b) => b.titulo.localeCompare(a.titulo));
    case "date_desc":
      // Extraer años para comparar (asumiendo formato YYYY-MM-DD o año como string)
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