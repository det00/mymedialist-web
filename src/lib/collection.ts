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

      // Intentar obtener datos con los endpoints existentes
      try {
        // Combinar datos de diferentes endpoints disponibles
        let combinedResults: Contenido[] = [];
        
        // Obtener contenido en progreso (endpoint que sí existe)
        const enProgresoResponse = await api.get("/home/current", {
          headers: { Authorization: `Bearer ${token}` }
        });
        combinedResults = [...combinedResults, ...enProgresoResponse.data];
        
        // Obtener contenido pendiente (endpoint que sí existe)
        const pendientesResponse = await api.get("/home/watchlist", {
          headers: { Authorization: `Bearer ${token}` }
        });
        combinedResults = [...combinedResults, ...pendientesResponse.data];
        
        // Aplicamos filtros si existen
        if (filters?.tipo && filters.tipo !== "todo") {
          const tipoMayuscula = filters.tipo.charAt(0).toUpperCase();
          combinedResults = combinedResults.filter(item => 
            item.tipo && item.tipo.charAt(0).toUpperCase() === tipoMayuscula
          );
        }
        
        if (filters?.estado && filters.estado !== "todo") {
          // Corrección: Usar el campo estado directamente
          combinedResults = combinedResults.filter(item => 
            item.estado === filters.estado
          );
        }
        
        // Aplicar ordenación si se especifica
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

      // Intentar usar el endpoint de actualización de estado
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
        
        // Si falla, intentar con el endpoint de estado que sabemos que funciona
        // Necesitamos obtener id_api y tipo para usar este endpoint
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

      // Este endpoint debería existir
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
   * Obtener un elemento por su ID (simulado)
   * @param id ID del elemento
   * @returns Elemento de la colección o null
   */
  async getItemById(id: string): Promise<Contenido | null> {
    // Como no tenemos un endpoint para esto, usamos la colección completa
    try {
      const collection = await this.getUserCollection();
      return collection.find(item => item.id === id) || null;
    } catch (error) {
      console.error("Error al buscar elemento por ID:", error);
      return null;
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
        // CORRECCIÓN: Usar el estado directamente en lugar de item.item?.estado
        if (item.estado) {
          // Incrementamos el contador para este estado
          if (stats.byStatus[item.estado as keyof typeof stats.byStatus] !== undefined) {
            stats.byStatus[item.estado as keyof typeof stats.byStatus]++;
          }
        }
        
        if (item.tipo) {
          // Obtenemos la primera letra del tipo en mayúscula
          const tipoMayuscula = item.tipo.charAt(0).toUpperCase() as 'P' | 'S' | 'L' | 'V';
          // Incrementamos el contador para este tipo
          if (stats.byType[tipoMayuscula as keyof typeof stats.byType] !== undefined) {
            stats.byType[tipoMayuscula as keyof typeof stats.byType]++;
          }
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