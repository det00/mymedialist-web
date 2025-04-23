import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { ContentItem } from "./types";


export const homeService = {
  async getTrending(limit: number = 5): Promise<ContentItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
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

  async getCurrentContent(): Promise<ContentItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentItem[]>("/home/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al obtener contenido en progreso:", error);
      return [];
    }
  },

  async getWatchlist(): Promise<ContentItem[]> {
    try {
      console.log("Obteniendo watchlist...");
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ContentItem[]>("/home/watchlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta de watchlist:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener watchlist:", error);
      return [];
    }
  },

  async updateItemState(
    id_api: string,
    tipo: string,
    estado: string
  ): Promise<any> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      try {
        console.log(`Verificando si existe el ítem: ${id_api}, tipo: ${tipo}`);
        const searchResponse = await api.get(
          `/${
            tipo === "V"
              ? "videojuego"
              : tipo === "L"
              ? "libro"
              : tipo === "S"
              ? "serie"
              : "pelicula"
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              id_api,
            },
          }
        );

        const existingItem = searchResponse.data.item;
        console.log("Ítem existente:", existingItem);

        if (!estado && existingItem) {
          console.log(`Eliminando ítem: ${existingItem.id}`);
          return await api.delete(`/user-items/${existingItem.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (existingItem) {
          console.log(
            `Actualizando estado del ítem ${existingItem.id} a ${estado}`
          );
          return await api.put(
            `/user-items/${existingItem.id}`,
            {
              estado,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (err) {
        console.error("Error al verificar si existe el ítem:", err);

      }

      if (estado) {
        console.log(
          `Creando nuevo ítem: ${id_api}, tipo: ${tipo}, estado: ${estado}`
        );
        return await api.post(
          "/user-items",
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
      }

      return { message: "No se realizó ninguna acción" };
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  },
};

export default homeService;
