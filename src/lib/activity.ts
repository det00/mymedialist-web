// src/lib/activity.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import type { ActivityItem } from "./types";


export const activityService = {
  /**
   * Obtener actividad del usuario autenticado y sus amigos
   * @param page Número de página (inicia en 1)
   * @param limit Límite de elementos por página
   * @returns Promesa con los items de actividad
   */
  async getMyActivity(page: number = 1, limit: number = 10): Promise<ActivityItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ActivityItem[]>("/actividad", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          pagina: page,
          limite: limit
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener actividad del usuario:", error);
      return [];
    }
  },
  
  /**
   * Obtener actividad de un usuario específico
   * @param userId ID del usuario
   * @param page Número de página (inicia en 1)
   * @param limit Límite de elementos por página
   * @returns Promesa con los items de actividad
   */
  async getUserActivity(userId: string, page: number = 1, limit: number = 10): Promise<ActivityItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ActivityItem[]>(`/actividad/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          pagina: page,
          limite: limit
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error al obtener actividad del usuario ${userId}:`, error);
      return [];
    }
  },
  
  /**
   * Obtener tipos de contenido en formato legible
   * @param type Tipo de contenido (P, S, L, V)
   * @returns Nombre legible del tipo de contenido
   */
  getContentTypeName(type: string): string {
    switch (type) {
      case "P":
        return "Película";
      case "S":
        return "Serie";
      case "L":
        return "Libro";
      case "V":
        return "Videojuego";
      default:
        return "Contenido";
    }
  },
  
  /**
   * Obtener URL del tipo de contenido para enlaces
   * @param type Tipo de contenido (P, S, L, V)
   * @returns URL del tipo de contenido
   */
  getContentTypeUrl(type: string): string {
    switch (type) {
      case "P":
        return "pelicula";
      case "S":
        return "serie";
      case "L":
        return "libro";
      case "V":
        return "videojuego";
      default:
        return "contenido";
    }
  },
  
  /**
   * Obtener descripción de acción en formato legible
   * @param actionType Tipo de acción
   * @returns Descripción legible de la acción
   */
  getActionDescription(actionType: string): string {
    switch (actionType) {
      case "added":
        return "ha añadido";
      case "started":
        return "ha empezado";
      case "finished":
        return "ha completado";
      case "dropped":
        return "ha abandonado";
      default:
        return "ha actualizado";
    }
  }
};

export default activityService;