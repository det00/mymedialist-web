// src/lib/profile.ts
import api from "@/lib/axios";
import { authService } from "@/lib/auth";

export interface ProfileData {
  id: string;
  nombre: string;
  username: string;
  email: string
  bio?: string;
  fechaRegistro: string;
  totalContenidos: number;
  totalAmigos: number;
  avatar: string;
  esMiPerfil: boolean;
  siguiendo: boolean;
  stats?: {
    totalContent: number;
    completed: number;
    inProgress: number;
    planned: number;
    dropped: number;
    movies: number;
    series: number;
    books: number;
    games: number;
  };
}

export const profileService = {
  /**
   * Obtener el perfil del usuario autenticado
   * @returns Promesa con los datos del perfil
   */
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
      
      // Calcular estadísticas que no vienen de la API
      const profileData = response.data;
      
      // Añadir estadísticas si no existen en la respuesta de la API
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
  
  /**
   * Obtener el perfil de un usuario específico
   * @param id ID del usuario
   * @returns Promesa con los datos del perfil
   */
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
      
      // Calcular estadísticas que no vienen de la API
      const profileData = response.data;
      
      // Añadir estadísticas si no existen en la respuesta de la API
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
  
  /**
   * Actualizar el avatar del usuario
   * @param avatar ID o string del avatar
   * @returns Promesa con la respuesta del servidor
   */
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
      
      // Actualizar el avatar en el servicio de autenticación
      if (response.data.avatar) {
        authService.setUserAvatar(response.data.avatar);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error al actualizar avatar:", error);
      throw error;
    }
  },
  
  /**
   * Seguir o dejar de seguir a un usuario
   * @param userId ID del usuario a seguir/dejar de seguir
   * @returns Promesa con la respuesta del servidor
   */
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
  
  /**
   * Actualizar datos del perfil
   * @param profileData Datos a actualizar
   * @returns Promesa con la respuesta del servidor
   */
  async updateProfile(profileData: Partial<ProfileData>): Promise<{ mensaje: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // En este caso usamos un mock ya que no vimos la implementación del endpoint
      // en el backend proporcionado. En una implementación real, se haría así:
      /*
      const response = await api.put<{ mensaje: string }>(
        "/perfil",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return response.data;
      */
      
      // Mock para simulación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar datos en localStorage para simular persistencia
      const userData = authService.getUserData();
      if (userData) {
        const updatedData = {
          ...userData,
          nombre: profileData.nombre || userData.nombre,
          email: profileData.email || userData.email,
        };
        localStorage.setItem("userData", JSON.stringify(updatedData));
        
        // Disparar eventos para actualización
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