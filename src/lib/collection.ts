// src/lib/collection.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { ContenidoColeccion } from "@/lib/types";

interface ResponseAdd{
  id: number,
  message: string
}

export const collectionService = {
  async addToCollection(
    id_api: string,
    tipo: string,
    estado: string
  ): Promise<ResponseAdd> {
    console.log(id_api, tipo, estado);
    
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
        
      }
      const res = await api.post(
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
      return res.data
    } catch (error) {
      console.error("Error al añadir a la colección:", error);
      throw error;
    }
  },

  async updateItem(id: number, estado: string): Promise<void> {
    
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      try {
        await api.put(
          `/user-items/${id}`,
          {
            estado,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (innerError) {
        console.warn(
          "Ya existe en la colección, hay que actualizar",
          innerError
        );
      }
    } catch (error) {
      console.error("Error al actualizar elemento:", error);
      throw error;
    }
  },

  async removeFromCollection(id: number): Promise<void> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      await api.delete(`/user-items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al eliminar de la colección:", error);
      throw error;
    }
  },

  async getItemById(id: string): Promise<ContenidoColeccion | null> {
    try {
      const collection = await this.getAllContent();
      return collection.find((item) => item.id === id) || null;
    } catch (error) {
      console.error("Error al buscar elemento por ID:", error);
      return null;
    }
  },

  async getAllContent(): Promise<ContenidoColeccion[]> {
    const token = authService.getToken();
    if (!token) {
      return [];
    }
    const userId = localStorage.getItem("id_usuario");
    if (!userId) {
      return [];
    }

    const response = await api.get<Contenido[]>(
      `/user-items/coleccion/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
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
      const collection = await this.getAllContent();
      const stats = {
        total: collection.length,
        byStatus: {
          C: 0,
          E: 0,
          P: 0,
          A: 0,
        },
        byType: {
          P: 0,
          S: 0,
          L: 0,
          V: 0,
        },
      };

      collection.forEach((item) => {
        if (item.estado) {
          if (
            stats.byStatus[item.estado as keyof typeof stats.byStatus] !==
            undefined
          ) {
            stats.byStatus[item.estado as keyof typeof stats.byStatus]++;
          }
        }

        if (item.tipo) {
          const tipoMayuscula = item.tipo.charAt(0).toUpperCase() as
            | "P"
            | "S"
            | "L"
            | "V";
          if (
            stats.byType[tipoMayuscula as keyof typeof stats.byType] !==
            undefined
          ) {
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
        byType: { P: 0, S: 0, L: 0, V: 0 },
      };
    }
  },
};

function sortCollection(
  collection: ContenidoColeccion[],
  sortBy: string
): ContenidoColeccion[] {
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
      return [...collection].sort(
        (a, b) => (b.valoracion || 0) - (a.valoracion || 0)
      );
    default:
      return collection;
  }
}

export default collectionService;
