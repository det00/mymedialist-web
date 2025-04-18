"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "./ui/auth-modal";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

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

  return (
    <>
      {children}
      
      {/* Modal de autenticación */}
      <AuthModal 
        showModal={showModal} 
        setShowModal={setShowModal} 
        initialView="login" 
      />
    </>
  );
}