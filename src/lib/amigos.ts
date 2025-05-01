import { authService } from "./auth";
import api from "./axios";
import { Seguidor, Usuario } from "./types";

interface ResponseSeguir {
  siguiendo: boolean;
  mensaje: string;
}

const amigosService = {
  async buscarUsuarios(query: string): Promise<Usuario[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      const res = await api.get(`/usuarios/buscar`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      return [];
    }
  },

  async seguirUsuario(id: number): Promise<ResponseSeguir> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      const res = await api.post<ResponseSeguir>(
        `/perfil/usuario/toggle-follow/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error al seguir usuario:", error);
      return { siguiendo: false, mensaje: "Error al seguir usuario" };
    }
  },

  async getSeguidores (userId: number): Promise<Seguidor[]> {
    try{
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      } 
      const res = await api.get<Seguidor[]>(`/social/seguidores/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener seguidores:", error);
      return [];
    }
  },

  async getSeguidos (userId: number): Promise<Seguidor[]> {
    try{
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      } 
      const res = await api.get<Seguidor[]>(`/social/seguidos/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener seguidos:", error);
      return [];
    }
  }



};
export default amigosService;
