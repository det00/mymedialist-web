"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "./ui/auth-modal";
import { Search, Film, Tv, BookOpen, Gamepad2 } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { UserAvatar } from "./UserAvatar";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import { SearchExpanded } from "./SearchExpanded";

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
  const searchParams = useSearchParams();
  const [showInicioSesion, setShowInicioSesion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTipoDropdown, setShowTipoDropdown] = useState<boolean>(false);
  const [showSearchExpanded, setShowSearchExpanded] = useState<boolean>(false);
  const { datosPerfil } = useProfile(authService.getUserId());

  // Tipos de contenido con sus iconos
  const tiposContenido = [
    { id: "P", nombre: "Películas", icon: Film },
    { id: "S", nombre: "Series", icon: Tv },
    { id: "L", nombre: "Libros", icon: BookOpen },
    { id: "V", nombre: "Videojuegos", icon: Gamepad2 },
  ];

  // Obtener el icono y nombre actual del tipo seleccionado
  const tipoActual =
    tiposContenido.find((t) => t.id === tipo) || tiposContenido[0];
  const IconoActual = tipoActual.icon;

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && busqueda.trim()) {
      event.preventDefault();
      setShowSearchExpanded(true);
    }
  };

  const handleSearch = () => {
    if (busqueda.trim()) {
      setShowSearchExpanded(true);
    }
  };
  
  // Cerrar búsqueda expandida
  const handleCloseSearch = () => {
    setShowSearchExpanded(false);
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
    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    window.addEventListener("storage", handleUserDataUpdate);

    // Ejecutar la verificación inicial
    handleUserDataUpdate();

    // Limpiar listeners al desmontar
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
      window.removeEventListener("storage", handleUserDataUpdate);
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
    window.dispatchEvent(new Event("userDataUpdated"));
    window.dispatchEvent(new Event("storage"));

    // Redirigir a la página principal
    router.push("/");
  };

  return (
    <header className="w-full border-b bg-background px-4 py-2 shadow-sm text-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo siempre visible */}
        <div
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => router.push("/")}
        >
          MyMediaList
        </div>

        {/* Elementos visibles en móviles */}
        <div className="lg:hidden flex items-center gap-3 ml-auto">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowSearchExpanded(true)}
            className="h-9 w-9"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <ThemeSwitch />
          
          <Link href={`/perfil?tabAction=profile`}>
            <UserAvatar
              key={`nav-avatar-mobile-${datosPerfil?.avatar}`}
              avatarData={datosPerfil?.avatar || "avatar1"}
              size="sm"
              tabAction="profile"
            />
          </Link>
        </div>

        {/* Barra de búsqueda - oculta en móviles, visible en desktop */}
        <div className="hidden lg:flex relative justify-center w-2xl mx-auto items-center">
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
              onClick={() => setShowSearchExpanded(true)}
              className={"rounded-2xl pl-10 pr-24 cursor-pointer"}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <DropdownMenu
                open={showTipoDropdown}
                onOpenChange={setShowTipoDropdown}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                  >
                    <IconoActual className="h-4 w-4" />
                    {tipoActual.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {tiposContenido.map((tipoItem) => (
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

        {/* Iconos de usuario y tema - visibles en desktop, ocultos en móvil */}
        <div className="hidden lg:flex w-auto items-center gap-4 justify-end">
          <ThemeSwitch />
          <Link href={`/perfil?tabAction=profile`}>
            <UserAvatar
              key={`nav-avatar-${datosPerfil?.avatar}`}
              avatarData={datosPerfil?.avatar || "avatar1"}
              size="md"
              tabAction="profile"
            />
          </Link>
        </div>
      </div>

      {/* Modal de autenticación */}
      <AuthModal
        showModal={showInicioSesion}
        setShowModal={setShowInicioSesion}
        initialView="login"
      />
      
      {/* Componente de búsqueda expandida */}
      <SearchExpanded
        isOpen={showSearchExpanded}
        onClose={handleCloseSearch}
        initialQuery={busqueda}
        initialType={tipo}
      />
    </header>
  );
}