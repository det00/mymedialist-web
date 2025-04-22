// src/lib/home.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";

export interface ContentItem {
  id?: string;
  id_api: string;
  tipo: string;
  imagen: string | null;
  titulo: string;
  autor: string;
  genero?: string[];
  estado?: string;
  numAmigos?: number;
  ultimaActividad?: string;
}

export const homeService = {
  /**
   * Obtener tendencias entre amigos
   * @param limit Número máximo de resultados
   * @returns Promesa con la lista de contenido popular
   */
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

  /**
   * Obtener contenido en progreso del usuario
   * @returns Promesa con la lista de contenido en progreso
   */
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

  /**
   * Obtener lista de contenido pendiente del usuario
   * @returns Promesa con la lista de contenido pendiente
   */
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

  /**
   * Añadir o actualizar un ítem en la colección del usuario
   * @param id_api ID del contenido en la API externa
   * @param tipo Tipo de contenido (P, S, L, V)
   * @param estado Estado del contenido (C, E, P, A)
   * @returns Promesa con la respuesta del servidor
   */
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

      // Primero verificamos si ya existe el ítem para este usuario
      // Esto lo haremos haciendo una solicitud GET para buscar el ítem
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

        // Si estado está vacío, eliminar el ítem
        if (!estado && existingItem) {
          console.log(`Eliminando ítem: ${existingItem.id}`);
          return await api.delete(`/user-items/${existingItem.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Si ya existe el ítem, actualizar su estado
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
        // Continuamos intentando crear un nuevo ítem
      }

      // Si no existe el ítem o hubo un error al verificar, crear uno nuevo
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
