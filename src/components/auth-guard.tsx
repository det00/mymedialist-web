"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./ui/auth-modal";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si hay un token almacenado
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    
    // Si requiere autenticación y no hay token, mostrar el modal
    if (requireAuth && !storedToken) {
      setShowModal(true);
    }
    
    setLoading(false);
  }, [requireAuth]);

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Si se requiere autenticación y no hay token, mostrar el modal
  if (requireAuth && !token) {
    return (
      <>
        {/* Mostrar algún contenido de placeholder para páginas que requieren autenticación */}
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-center mb-6">
            Necesitas iniciar sesión para acceder a esta página
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Iniciar sesión
          </button>
        </div>
        
        {/* Modal de autenticación */}
        <AuthModal 
          showModal={showModal} 
          setShowModal={setShowModal} 
          initialView="login" 
        />
      </>
    );
  }

  // Si no se requiere autenticación o hay token, mostrar el contenido normal
  return (
    <>
      {children}
      
      {/* Modal de autenticación (se muestra solo si showModal es true) */}
      <AuthModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        initialView="login" 
      />
    </>
  );
}