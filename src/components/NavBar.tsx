"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AuthModal } from "./ui/auth-modal";
import { Search } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { UserAvatar } from "./UserAvatar";
import { authService } from "@/lib/auth";

interface UserData {
  nombre: string;
  email: string;
  avatar: string;
}

export function Navbar() {
  const [busqueda, setBusqueda] = useState<string>("");
  const [tipo, setTipo] = useState<string>("P");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const [showInicioSesion, setShowInicioSesion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      router.push(
        `/busqueda?busqueda=${encodeURIComponent(
          busqueda
        )}&tipo=${encodeURIComponent(tipo)}`
      );
    }
  };

  useEffect(() => {
    // Comprobar autenticación usando el servicio
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      // Obtener datos del usuario
      const userInfo = authService.getUserData();
      console.log("Datos de usuario cargados:", userInfo);
      setUserData(userInfo);
    }
    
    setLoading(false);
    
    // Añadir un event listener para detectar cambios en localStorage
    const handleStorageChange = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userInfo = authService.getUserData();
        setUserData(userInfo);
      } else {
        setUserData(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // También podemos crear un evento personalizado para actualizaciones internas
    window.addEventListener('userDataUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataUpdated', handleStorageChange);
    };
  }, []);

  const cerrarSesion = () => {
    // Usar el servicio de autenticación para cerrar sesión
    authService.logout();
    setIsAuthenticated(false);
    setUserData(null);
    
    // Redirigir a la página principal
    router.push("/");
  };

  return (
    <header className="w-full border-b bg-background px-4 py-2 shadow-sm text-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="text-xl font-bold text-primary w-32 cursor-pointer" onClick={() => router.push("/")}>
          MyMediaList
        </div>

        <div className="relative justify-center w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar series, pelis, libros..."
            value={busqueda}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBusqueda(e.target.value)
            }
            onKeyDown={handleEnter}
            className={"rounded-2xl pl-10"}
          />
        </div>
        <div className="w-auto flex items-center gap-4 justify-end">
          <ThemeSwitch />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                {loading ? (
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                ) : isAuthenticated && userData ? (
                  <UserAvatar avatarData={userData.avatar || "avatar1"} />
                ) : (
                  <UserAvatar avatarData="initial_#6C5CE7_US" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem 
                    onClick={() => router.push("/perfil")}
                    className="cursor-pointer"
                  >
                    Mi perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => router.push("/coleccion")}
                    className="cursor-pointer"
                  >
                    Mi colección
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={cerrarSesion}
                    className="text-destructive cursor-pointer"
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    console.log("Abriendo modal de inicio de sesión");
                    setShowInicioSesion(true);
                  }}
                  className="cursor-pointer"
                >
                  Iniciar sesión
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AuthModal 
        showModal={showInicioSesion} 
        setShowModal={setShowInicioSesion} 
        initialView="login" 
      />
    </header>
  );
}