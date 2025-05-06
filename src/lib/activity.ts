// src/lib/activity.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import type { ActivityItem } from "./types";


export const activityService = {
  async getUserActivity(userId: number, page: number = 1, limit: number = 10): Promise<ActivityItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ActivityItem[]>(`/user-items/coleccion/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          pagina: page,
          limite: limit
        }
      });

      console.log("response", response);
      
      
      return response.data;
    } catch (error) {
      console.error(`Error al obtener actividad del usuario ${userId}:`, error);
      return [];
    }
  },

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
  
  getActionDescription(actionType: string): string {
    switch (actionType) {
      case "E":
        return "ha añadido";
      case "P":
        return "ha empezado";
      case "C":
        return "ha completado";
      case "A":
        return "ha abandonado";
      default:
        return "ha actualizado";
    }
  }
};

export default activityService;