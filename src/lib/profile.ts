// src/lib/profile.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { Perfil } from "./types";


export const profileService = {
  
  async getPerfil(id: number): Promise<Perfil> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const res = await api.get<Perfil>(`/perfil/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const datosPerfil = res.data;
      
      if (!datosPerfil.estadisticas) {
        datosPerfil.estadisticas = {
          completados: Math.floor(datosPerfil.totalContenidos * 0.5) || 0,
          enProgreso: Math.floor(datosPerfil.totalContenidos * 0.2) || 0,
          pendiente: Math.floor(datosPerfil.totalContenidos * 0.2) || 0,
          abandonado: Math.floor(datosPerfil.totalContenidos * 0.1) || 0,
          peliculas: Math.floor(datosPerfil.totalContenidos * 0.4) || 0,
          series: Math.floor(datosPerfil.totalContenidos * 0.3) || 0,
          libros: Math.floor(datosPerfil.totalContenidos * 0.2) || 0,
          juegos: Math.floor(datosPerfil.totalContenidos * 0.1) || 0
        };
      }
      
      return datosPerfil;
    } catch (error) {
      console.error(`Error al obtener perfil del usuario ${id}:`, error);
      throw error;
    }
  },
  
  
  async toggleFollow(userId: string): Promise<{ siguiendo: boolean; mensaje: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.post<{ siguiendo: boolean; mensaje: string }>(
        `perfil/usuario/toggle-follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error al seguir/dejar de seguir al usuario ${userId}:`, error);
      throw error;
    }
  },
  

}