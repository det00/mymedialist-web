import api from "@/lib/axios";
import { LoginResponse, RegisterResponse, UserData } from "./types";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id_usuario", String(response.data.id));

        // Si el avatar viene en la respuesta del servidor, usarlo
        const serverAvatar = response.data.avatar || response.data.avatar_id;
        const avatarToUse = serverAvatar || localStorage.getItem("user_avatar") || "avatar1";
        
        // Guardar el avatar en localStorage
        localStorage.setItem("user_avatar", avatarToUse);
        
        const userData: UserData = {
          nombre: response.data.name || email.split("@")[0],
          email: email,
          avatar: avatarToUse,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        window.dispatchEvent(new Event("userDataUpdated"));
        window.dispatchEvent(new Event("storage"));
      }

      return response.data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  },

  async register(
    username: string,
    name: string,
    email: string,
    password: string,
    bio: string,
    avatar: string
  ): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/auth/register", {
        username,
        name,
        email,
        password,
        bio,
        avatar_id: avatar
      });

      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  setUserAvatar(avatar: string): void {
    // Guardar en ambas ubicaciones para mantener la consistencia
    localStorage.setItem("user_avatar", avatar);

    // Actualizar completamente el objeto userData
    const currentUserData = this.getUserData();
    if (currentUserData) {
      // Reemplazar completamente el avatar anterior
      currentUserData.avatar = avatar;
      localStorage.setItem("userData", JSON.stringify(currentUserData));
    } else {
      // Si por alguna razón no hay userData, crear uno básico
      const basicUserData = {
        nombre: "Usuario",
        email: "",
        avatar: avatar
      };
      localStorage.setItem("userData", JSON.stringify(basicUserData));
    }

    // Forzar actualización en toda la aplicación con ambos eventos
    window.dispatchEvent(new Event("userDataUpdated"));
    window.dispatchEvent(new Event("storage"));
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("userData");
    localStorage.removeItem("currentContent");
    localStorage.removeItem("watchlist");
    localStorage.removeItem("trendingContent");

    console.log("Sesión cerrada correctamente");

    window.dispatchEvent(new Event("userDataUpdated"));
    window.dispatchEvent(new Event("storage"));
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUserData(): UserData | null {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (!parsedData.avatar) {
          parsedData.avatar = localStorage.getItem("user_avatar") || "avatar1";
        }
        return parsedData;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  },

  getUserId(): number {
    const id_usuario = Number(localStorage.getItem("id_usuario"));
    return id_usuario;
  },

  async deleteAccount(password: string): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Realizar la solicitud DELETE al endpoint con la contraseña
      const response = await api.delete("/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: { password } // Para peticiones DELETE, se usa 'data' en axios en lugar de 'body'
      });
      
      console.log("Cuenta eliminada correctamente");
      
      // Limpiar todos los datos locales
      localStorage.removeItem("token");
      localStorage.removeItem("id_usuario");
      localStorage.removeItem("userData");
      localStorage.removeItem("currentContent");
      localStorage.removeItem("watchlist");
      localStorage.removeItem("trendingContent");
      
      // Disparar eventos para notificar los cambios
      window.dispatchEvent(new Event("userDataUpdated"));
      window.dispatchEvent(new Event("storage"));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      throw error; // Propagar el error para que pueda ser manejado por el componente
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Verificar que la nueva contraseña cumpla con los requisitos mínimos
      if (newPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Realizar la solicitud POST al endpoint para cambiar la contraseña
      const response = await api.post("/auth/change-password", 
        { 
          currentPassword, 
          newPassword 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Contraseña actualizada correctamente");
      
      // No es necesario cerrar sesión ni limpiar datos, solo notificar el cambio
      window.dispatchEvent(new Event("userDataUpdated"));
      
      return Promise.resolve();
    } catch (error: any) {
      // Registrar el error completo para depuración
      console.error("Error al cambiar la contraseña:", error);
      
      // Mejorar el mensaje de error para proporcionar información más útil
      if (error.response) {
        // Si el servidor devuelve una respuesta con un mensaje de error, usarlo
        if (error.response.data && (error.response.data.message || error.response.data.error)) {
          const serverMessage = error.response.data.message || error.response.data.error;
          throw new Error(serverMessage);
        }
      }
      
      // Si no hay un mensaje específico del servidor, propagar el error original
      throw error;
    }
  },
};

export default authService;