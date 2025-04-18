"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import api from "@/lib/axios";
import axios, { AxiosError } from "axios";

interface LoginFormProps {
  showInicioSesion: (value: boolean) => void;
  showRegister?: () => void;
  handleContinueAsGuest?: () => void;
}

interface InicioSesion {
  token: string;
  id: string;
}

export function LoginForm(props: LoginFormProps) {
  const { showInicioSesion, showRegister, handleContinueAsGuest } = props;
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
      console.log("Intentando iniciar sesión con:", { email, password });
      const res = await api.post<InicioSesion>("auth/login", {
        email,
        password
      });
      
      // Verificar si el token existe
      if (!res.data.token) {
        setError("Error de autenticación: Token no recibido");
        return false;
      }
      
      console.log("Respuesta de login:", res.data);
      
      // Guardar token en localStorage
      localStorage.setItem("token", res.data.token);
      
      // Guardar ID del usuario
      localStorage.setItem("id_usuario", res.data.id);
      
      console.log("Inicio de sesión exitoso");
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      
      // Manejar diferentes tipos de errores para dar feedback más específico
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        if (axiosError.response) {
          // El servidor respondió con un status code fuera del rango 2xx
          if (axiosError.response.status === 401) {
            setError("Email o contraseña incorrectos");
          } else {
            setError(`Error del servidor: ${
              axiosError.response.data?.message || "Intenta de nuevo más tarde"
            }`);
          }
        } else if (axiosError.request) {
          // La petición fue hecha pero no se recibió respuesta
          setError("No se pudo conectar con el servidor. Verifica tu conexión.");
        } else {
          // Algo ocurrió al configurar la petición
          setError(`Error de red: ${axiosError.message}`);
        }
      } else {
        // Error no relacionado con Axios
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

  const handleGuestContinue = () => {
    console.log("Intentando continuar como invitado", handleContinueAsGuest);
    if (handleContinueAsGuest) {
      handleContinueAsGuest();
    } else {
      console.error("Función handleContinueAsGuest no disponible");
      // Fallback: simplemente cerrar el modal
      showInicioSesion(false);
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              o continúa con
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGuestContinue}
        >
          Continuar como invitado
        </Button>
      </CardFooter>
    </Card>
  );
}