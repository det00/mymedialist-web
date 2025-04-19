"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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

  // Simular inicio de sesión sin backend
  const iniciarSesion = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Para propósitos de demo, aceptar cualquier email/contraseña
      // En una implementación real, esto se validaría con el backend
      
      // Crear datos de usuario para modo estático
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      
      // Si no hay datos existentes, crear unos datos ficticios de demo
      if (!Object.keys(userData).length) {
        const demoUserData = {
          nombre: "Usuario Demo",
          email: email,
          avatar: "avatar1"
        };
        localStorage.setItem("userData", JSON.stringify(demoUserData));
      }
      
      // Generar token falso
      localStorage.setItem("token", "fake-token-" + Date.now());
      localStorage.setItem("id_usuario", "user123");
      
      console.log("Inicio de sesión simulado exitoso");
      return true;
    } catch (error) {
      console.error("Error en simulación:", error);
      setError("Error al simular el inicio de sesión");
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
      
      // Opcional: Recargar la página o redirigir
      window.location.reload();
    }
  };

  const handleSwitchToRegister = () => {
    console.log("Intentando cambiar a registro", showRegister);
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
              <Button variant="link" className="p-0 h-auto text-xs">
                ¿Olvidaste tu contraseña?
              </Button>
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
          
          <div className="text-xs text-center text-muted-foreground">
            Para fines de demostración, puedes usar cualquier email y contraseña
          </div>
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