// src/lib/auth.ts
import api from "@/lib/axios";

// Interfaces para los tipos de datos
interface LoginResponse {
  token: string;
  id: number;
}

interface RegisterResponse {
  message: string;
}

interface UserData {
  nombre: string;
  email: string;
  avatar: string;
}

// Servicio de autenticación
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Promesa con la respuesta del servidor (token y id)
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password
      });
      
      // Guardar token y datos de usuario en localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id_usuario", String(response.data.id));
        
        // Preservar avatar existente si ya hay datos de usuario
        const existingUserData = localStorage.getItem("userData");
        let avatar = "avatar1"; // Avatar por defecto
        
        if (existingUserData) {
          try {
            const userData = JSON.parse(existingUserData);
            if (userData.avatar) {
              avatar = userData.avatar;
            }
          } catch (e) {
            console.error("Error al procesar datos de usuario existentes:", e);
          }
        }
        
        // Crear o actualizar datos básicos de usuario
        const userData: UserData = {
          nombre: email.split('@')[0], // Temporal hasta obtener el nombre real
          email: email,
          avatar: avatar
        };
        localStorage.setItem("userData", JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  },
  
  /**
   * Registrar un nuevo usuario
   * @param name Nombre del usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Promesa con la respuesta del servidor
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },
  
  /**
   * Cerrar sesión (eliminar token y datos de localStorage)
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("userData");
  },
  
  /**
   * Verificar si el usuario está autenticado
   * @returns Booleano indicando si hay un token guardado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
  
  /**
   * Obtener el token de autenticación
   * @returns Token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  },
  
  /**
   * Obtener los datos del usuario desde localStorage
   * @returns Objeto con los datos del usuario o null
   */
  getUserData(): UserData | null {
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
};

export default authService;