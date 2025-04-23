// src/lib/home.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { ContentItem } from "./types";

export const homeService = {
  async getAllContent(): Promise<ContentItem[]> {
    const token = authService.getToken();
    if (!token) {
      return [];
    }

    // Obtenemos el ID del usuario del localStorage
    const userId = localStorage.getItem("id_usuario");
    if (!userId) {
      return [];
    }

    const response = await api.get<ContentItem[]>(`/user-items/coleccion/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  // Mantener métodos individuales por compatibilidad, pero ahora usan el caché local
  async getTrending(limit: number = 5): Promise<ContentItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await api.get<ContentItem[]>("/home/trending", {
        params: { limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al obtener tendencias:", error);
      return [];
    }
  },

  // Método optimista para actualizar estado
  async updateItemState(
    id_api: string,
    tipo: string,
    estado: string
  ): Promise<any> {
    const token = authService.getToken();
    if (!token) {
      return { success: false, message: "No autenticado" };
    }

    // Optimistic update: Disparar evento de actualización local
    window.dispatchEvent(new CustomEvent('contentStateUpdated', { 
      detail: { id_api, tipo, estado } 
    }));

    // Enviar la solicitud al servidor
    return api.post(
      "/estado",
      {
        id_api,
        tipo,
        estado,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

export default homeService;