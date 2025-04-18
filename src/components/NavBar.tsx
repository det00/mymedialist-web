"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { AuthModal } from "./ui/auth-modal";
import { Search } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";

// Ya no necesitamos una interfaz completa de usuario

export function Navbar() {
  const [busqueda, setBusqueda] = useState<string>("");
  const [tipo, setTipo] = useState<string>("P");
  const [token, setToken] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<string | null>(null);
  const router = useRouter();
  const [showInicioSesion, setShowInicioSesion] = useState<boolean>(false);

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
    // Recuperar token de localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    
    // Si no hay token, mostrar automáticamente el modal de inicio de sesión
    if (!storedToken) {
      setShowInicioSesion(true);
    }
    
    // Recuperar ID del usuario
    const storedIdUsuario = localStorage.getItem("id_usuario");
    if (storedIdUsuario) {
      setIdUsuario(storedIdUsuario);
    }
  }, []);

  const cerrarSesion = () => {
    // Eliminar token y ID de usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    
    // Actualizar estado
    setToken(null);
    setIdUsuario(null);
    
    // Opcional: redirigir a la página principal
    router.push("/");
  };

  // Ya que solo tenemos el ID, usaremos esto para el avatar
  const getUserAvatar = () => {
    return idUsuario ? "US" : "US";
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
              <Avatar className="cursor-pointer border border-border">
                {token ? (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserAvatar()}
                  </AvatarFallback>
                ) : (
                  <AvatarFallback>US</AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {token ? (
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