"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth-guard";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const [idUsuario, setIdUsuario] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Verificar si hay un token almacenado
    const storedToken = localStorage.getItem("token");
    const storedIdUsuario = localStorage.getItem("id_usuario");
    
    if (!storedToken) {
      // Si no hay token, redirigir al home
      router.push("/");
    } else {
      setIdUsuario(storedIdUsuario);
    }
  }, [router]);
  
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen flex flex-col px-8 sm:px-12 md:px-24 lg:px-32 py-8">
        <Card className="w-full max-w-5xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                ID de usuario: {idUsuario || "Cargando..."}
              </p>
              
              {/* Aquí irían más detalles del perfil, que se cargarían desde una API */}
              <p className="text-muted-foreground">
                Esta es una página protegida que requiere autenticación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}