// src/lib/collection.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { CardBasic } from "@/lib/types";

interface ResponseAdd {
  id: number;
  message: string;
}

export const collectionService = {
  async addToCollection(
    id_api: string,
    tipo: string,
    estado: string
  ): Promise<ResponseAdd> {
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
      return res.data;
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

  async getAllContent(userId?: number): Promise<CardBasic[]> {
    const token = authService.getToken();
    if (!token) {
      return [];
    }
    const localUserId = localStorage.getItem("id_usuario");

    const response = await api.get<CardBasic[]>(
      `/user-items/coleccion/${userId ? userId : localUserId}`,
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

  async getTendencias(): Promise<CardBasic[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      const response = await api.get<CardBasic[]>("/home/trending", {
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
};

export default collectionService;
