// src/lib/auth.ts
import api from "@/lib/axios";

// Interfaces para los tipos de datos
interface LoginResponse {
  token: string;
  id: number;
  name?: string;
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
        
        // Generar datos de usuario
        const userData: UserData = {
          nombre: response.data.name || email.split('@')[0], 
          email: email,
          avatar: localStorage.getItem("user_avatar") || "avatar1"
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Disparar eventos para actualización
        window.dispatchEvent(new Event('userDataUpdated'));
        window.dispatchEvent(new Event('storage'));
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
   * Establecer avatar del usuario
   * @param avatar ID o ruta del avatar
   */
  setUserAvatar(avatar: string): void {
    localStorage.setItem("user_avatar", avatar);
    
    // Actualizar datos de usuario existentes
    const currentUserData = this.getUserData();
    if (currentUserData) {
      currentUserData.avatar = avatar;
      localStorage.setItem("userData", JSON.stringify(currentUserData));
    }
    
    // Disparar eventos para actualización
    window.dispatchEvent(new Event('userDataUpdated'));
    window.dispatchEvent(new Event('storage'));
  },
  
  /**
   * Cerrar sesión (eliminar token y datos de localStorage)
   */
  logout(): void {
    // Eliminar todos los datos de autenticación y usuario
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("userData");
    
    // Mantener el avatar para futuras sesiones si existe
    // localStorage.removeItem("user_avatar");
    
    // Limpiar cualquier otro dato de sesión de la aplicación
    // Esto es importante para que no queden rastros de la sesión anterior
    localStorage.removeItem("currentContent");
    localStorage.removeItem("watchlist");
    localStorage.removeItem("trendingContent");
    
    console.log("Sesión cerrada correctamente");
    
    // Disparar eventos para notificar a todos los componentes
    window.dispatchEvent(new Event('userDataUpdated'));
    window.dispatchEvent(new Event('storage'));
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
      try {
        const parsedData = JSON.parse(userData);
        // Añadir fallback para avatar
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
  }
};

export default authService;