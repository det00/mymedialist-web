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
import { Search, Film, Tv, BookOpen, Gamepad2 } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { UserAvatar } from "./UserAvatar";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";

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
  const [showTipoDropdown, setShowTipoDropdown] = useState<boolean>(false);

  // Tipos de contenido con sus iconos
  const tiposContenido = [
    { id: "P", nombre: "Películas", icon: Film },
    { id: "S", nombre: "Series", icon: Tv },
    { id: "L", nombre: "Libros", icon: BookOpen },
    { id: "V", nombre: "Videojuegos", icon: Gamepad2 }
  ];

  // Obtener el icono y nombre actual del tipo seleccionado
  const tipoActual = tiposContenido.find(t => t.id === tipo) || tiposContenido[0];
  const IconoActual = tipoActual.icon;

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && busqueda.trim()) {
      event.preventDefault();
      router.push(
        `/busqueda?busqueda=${encodeURIComponent(
          busqueda
        )}&tipo=${encodeURIComponent(tipo)}`
      );
    }
  };

  const handleSearch = () => {
    if (busqueda.trim()) {
      router.push(
        `/busqueda?busqueda=${encodeURIComponent(
          busqueda
        )}&tipo=${encodeURIComponent(tipo)}`
      );
    }
  };

  const handleTipoChange = (nuevoTipo: string) => {
    setTipo(nuevoTipo);
    setShowTipoDropdown(false);
  };

  // Función para manejar cambios en los datos de usuario
  const handleUserDataUpdate = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const userInfo = authService.getUserData();
      setUserData(userInfo);
    } else {
      setUserData(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Configurar listeners de eventos
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    window.addEventListener('storage', handleUserDataUpdate);
    
    // Ejecutar la verificación inicial
    handleUserDataUpdate();
    
    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
      window.removeEventListener('storage', handleUserDataUpdate);
    };
  }, []);

  // Función mejorada de cierre de sesión
  const cerrarSesion = () => {
    // Usar el servicio de autenticación para cerrar sesión
    authService.logout();
    
    // Actualizar estado local
    setIsAuthenticated(false);
    setUserData(null);
    
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new Event('userDataUpdated'));
    window.dispatchEvent(new Event('storage'));
    
    // Redirigir a la página principal
    router.push("/");
  };

  return (
    <header className="w-full border-b bg-background px-4 py-2 shadow-sm text-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div 
          className="text-xl font-bold text-primary w-32 cursor-pointer" 
          onClick={() => router.push("/")}
        >
          MyMediaList
        </div>

        <div className="relative justify-center w-2xl mx-auto flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar series, pelis, libros..."
              value={busqueda}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBusqueda(e.target.value)
              }
              onKeyDown={handleEnter}
              className={"rounded-2xl pl-10 pr-24"}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <DropdownMenu open={showTipoDropdown} onOpenChange={setShowTipoDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    <IconoActual className="h-4 w-4" />
                    {tipoActual.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {tiposContenido.map(tipoItem => (
                    <DropdownMenuItem 
                      key={tipoItem.id}
                      onClick={() => handleTipoChange(tipoItem.id)}
                      className="cursor-pointer gap-2"
                    >
                      <tipoItem.icon className="h-4 w-4" />
                      {tipoItem.nombre}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="ml-1"
            onClick={handleSearch}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="w-auto flex items-center gap-4 justify-end">
          <ThemeSwitch />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                {loading ? (
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                ) : isAuthenticated && userData ? (
                  <UserAvatar 
                    avatarData={userData.avatar || "avatar1"} 
                    size="md" 
                  />
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