// src/lib/profile.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";
import { ProfileData } from "./types";


export const profileService = {

  async getMyProfile(): Promise<ProfileData> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ProfileData>("/perfil", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const profileData = response.data;
      
      if (!profileData.stats) {
        profileData.stats = {
          totalContent: profileData.totalContenidos || 0,
          completed: Math.floor(profileData.totalContenidos * 0.5) || 0,
          inProgress: Math.floor(profileData.totalContenidos * 0.2) || 0,
          planned: Math.floor(profileData.totalContenidos * 0.2) || 0,
          dropped: Math.floor(profileData.totalContenidos * 0.1) || 0,
          movies: Math.floor(profileData.totalContenidos * 0.4) || 0,
          series: Math.floor(profileData.totalContenidos * 0.3) || 0,
          books: Math.floor(profileData.totalContenidos * 0.2) || 0,
          games: Math.floor(profileData.totalContenidos * 0.1) || 0
        };
      }
      
      return profileData;
    } catch (error) {
      console.error("Error al obtener perfil del usuario:", error);
      throw error;
    }
  },
  
  async getUserProfile(id: string): Promise<ProfileData> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.get<ProfileData>(`/perfil/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const profileData = response.data;
      
      if (!profileData.stats) {
        profileData.stats = {
          totalContent: profileData.totalContenidos || 0,
          completed: Math.floor(profileData.totalContenidos * 0.5) || 0,
          inProgress: Math.floor(profileData.totalContenidos * 0.2) || 0,
          planned: Math.floor(profileData.totalContenidos * 0.2) || 0,
          dropped: Math.floor(profileData.totalContenidos * 0.1) || 0,
          movies: Math.floor(profileData.totalContenidos * 0.4) || 0,
          series: Math.floor(profileData.totalContenidos * 0.3) || 0,
          books: Math.floor(profileData.totalContenidos * 0.2) || 0,
          games: Math.floor(profileData.totalContenidos * 0.1) || 0
        };
      }
      
      return profileData;
    } catch (error) {
      console.error(`Error al obtener perfil del usuario ${id}:`, error);
      throw error;
    }
  },
  
  async updateAvatar(avatar: string): Promise<{ mensaje: string; avatar: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await api.put<{ mensaje: string; avatar: string }>(
        "/usuario/avatar",
        { avatar },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.avatar) {
        authService.setUserAvatar(response.data.avatar);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error al actualizar avatar:", error);
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
  
  async updateProfile(profileData: Partial<ProfileData>): Promise<{ mensaje: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = authService.getUserData();
      if (userData) {
        const updatedData = {
          ...userData,
          nombre: profileData.nombre || userData.nombre,
          email: profileData.email || userData.email,
        };
        localStorage.setItem("userData", JSON.stringify(updatedData));
        
        window.dispatchEvent(new Event('userDataUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
      
      return { mensaje: "Perfil actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }
};

export default profileService;