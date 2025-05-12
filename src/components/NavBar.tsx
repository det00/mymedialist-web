"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
// Ya no necesitamos los componentes de dropdown
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "./ui/auth-modal";
import { Search } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { UserAvatar } from "./UserAvatar";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import Image from "next/image";
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
  const [showSearchExpanded, setShowSearchExpanded] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchBarRect, setSearchBarRect] = useState<DOMRect | null>(null);
  const { datosPerfil } = useProfile(authService.getUserId());

  // Ya no necesitamos los tipos de contenido para el dropdown

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && busqueda.trim()) {
      event.preventDefault();
      // Capturar las dimensiones y posición de la barra de búsqueda antes de expandirla
      if (searchInputRef.current) {
        setSearchBarRect(searchInputRef.current.getBoundingClientRect());
      }
      setShowSearchExpanded(true);
    }
  };

  // Ya no necesitamos la función handleSearch

  // Cerrar búsqueda expandida
  const handleCloseSearch = () => {
    setShowSearchExpanded(false);
  };

  // Ya no necesitamos manejar el cambio de tipo en la navbar

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
          className="flex w-1/8 items-center justify-center cursor-pointer p-0 ml-4"
          onClick={() => router.push("/")}
        >
          <Image 
            src="/log.svg" 
            alt="MyMediaList Logo" 
            width={250} 
            height={20} 
            className="h-10 w-auto min-w-20" 
            style={{ margin: 0, padding: 0 }}
          />
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
              ref={searchInputRef}
              type="text"
              placeholder="Buscar series, pelis, libros..."
              value={busqueda}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBusqueda(e.target.value)
              }
              onKeyDown={handleEnter}
              onClick={() => {
                if (searchInputRef.current) {
                  setSearchBarRect(searchInputRef.current.getBoundingClientRect());
                }
                setShowSearchExpanded(true);
              }}
              className={"rounded-2xl pl-10 pr-4 cursor-pointer"}
            />
          </div>
          {/* Eliminado el botón de búsqueda */}
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
      <AnimatePresence>
        {showSearchExpanded && (
          <SearchExpanded
            isOpen={showSearchExpanded}
            onClose={handleCloseSearch}
            initialQuery={busqueda}
            initialType={tipo}
            sourceRect={searchBarRect}
          />
        )}
      </AnimatePresence>
    </header>
  );
}