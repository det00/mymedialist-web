import api from "@/lib/axios";
import { LoginResponse, RegisterResponse, UserData } from "./types";

export const authService = {

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password
      });
      

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id_usuario", String(response.data.id));
        
        const userData: UserData = {
          nombre: response.data.name || email.split('@')[0], 
          email: email,
          avatar: localStorage.getItem("user_avatar") || "avatar1"
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        
        window.dispatchEvent(new Event('userDataUpdated'));
        window.dispatchEvent(new Event('storage'));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    }
  },
  
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
  
  setUserAvatar(avatar: string): void {
    localStorage.setItem("user_avatar", avatar);

    const currentUserData = this.getUserData();
    if (currentUserData) {
      currentUserData.avatar = avatar;
      localStorage.setItem("userData", JSON.stringify(currentUserData));
    }

    window.dispatchEvent(new Event('userDataUpdated'));
    window.dispatchEvent(new Event('storage'));
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("userData");
    localStorage.removeItem("currentContent");
    localStorage.removeItem("watchlist");
    localStorage.removeItem("trendingContent");
  
    console.log("Sesión cerrada correctamente");
    
    window.dispatchEvent(new Event('userDataUpdated'));
    window.dispatchEvent(new Event('storage'));
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
  }
};

export default authService;