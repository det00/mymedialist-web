"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { authService } from "@/lib/auth";

interface LoginFormProps {
  showInicioSesion: (value: boolean) => void;
  showRegister?: () => void;
}

export function LoginForm(props: LoginFormProps) {
  const { showInicioSesion, showRegister } = props;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const iniciarSesion = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Llamar al servicio de autenticación
      await authService.login(email, password);
      return true;
    } catch (error: any) {
      console.error("Error en inicio de sesión:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 401) {
          setError("Credenciales incorrectas");
        } else {
          setError("Error en el servidor. Inténtalo de nuevo.");
        }
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        setError("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        // Error en la configuración de la petición
        setError("Error al procesar la solicitud");
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }
    
    const success = await iniciarSesion();
    
    if (success) {
      // Cerrar el modal
      showInicioSesion(false);
      
      // Disparar evento personalizado para actualizar la UI sin recargar
      window.dispatchEvent(new Event('userDataUpdated'));
      
      // Cerrar modal y recargar la página después de un breve retraso
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleSwitchToRegister = () => {
    if (showRegister) {
      showRegister();
    } else {
      console.error("Función showRegister no disponible");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => showInicioSesion(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={handleEmail}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePassword}
              disabled={loading}
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={handleSwitchToRegister}
          >
            Regístrate
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}