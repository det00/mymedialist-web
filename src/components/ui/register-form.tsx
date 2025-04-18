"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import api from "@/lib/axios";
import axios, { AxiosError } from "axios";

interface RegisterFormProps {
  showRegistro: (value: boolean) => void;
  showLogin: () => void;
}

interface Registro {
  message?: string;
}

export function RegisterForm({ showRegistro, showLogin }: RegisterFormProps) {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registrarUsuario = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Intentando registrar usuario:", { nombre, email, password });
      const res = await api.post<Registro>("auth/register", {
        email,
        password,
        name: nombre
      });
      
      console.log("Respuesta de registro:", res.data);
      
      // Si llegamos aquí, significa que el registro fue exitoso
      // pero aún necesitamos iniciar sesión para obtener el token
      try {
        console.log("Intentando inicio de sesión automático después del registro");
        const loginRes = await api.post<{ token: string; id: string }>("auth/login", {
          email,
          password
        });
        
        console.log("Respuesta de login post-registro:", loginRes.data);
        
        // Guardar token en localStorage
        localStorage.setItem("token", loginRes.data.token);
        
        // Guardar ID del usuario
        localStorage.setItem("id_usuario", loginRes.data.id);
        
        console.log("Registro e inicio de sesión exitosos");
        return true;
      } catch (loginError) {
        console.error("Registro exitoso pero error al iniciar sesión:", loginError);
        setError("Tu cuenta fue creada correctamente. Por favor, inicia sesión manualmente.");
        return true; // Devolvemos true porque el registro fue exitoso
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      
      // Manejar diferentes tipos de errores
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<Registro>;
        if (axiosError.response) {
          // Si hay un mensaje, es un error
          if (axiosError.response.data?.message) {
            setError(axiosError.response.data.message);
          } else {
            setError("Error desconocido al registrar usuario");
          }
        } else if (axiosError.request) {
          setError("No se pudo conectar con el servidor. Verifica tu conexión.");
        } else {
          setError(`Error de red: ${axiosError.message}`);
        }
      } else {
        setError("Error al procesar la solicitud");
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!nombre || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    const success = await registrarUsuario();
    
    if (success) {
      // Cerrar el modal
      showRegistro(false);
      
      // Opcional: Recargar la página
      window.location.reload();
    }
  };

  const handleSwitchToLogin = () => {
    console.log("Intentando cambiar a login", showLogin);
    if (showLogin) {
      showLogin();
    } else {
      console.error("Función showLogin no disponible");
      // Fallback: cerrar el registro
      showRegistro(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg">
      <CardHeader className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={() => showRegistro(false)}
        >
          <X className="h-5 w-5" />
        </Button>
        <CardTitle className="text-2xl text-center">Crear cuenta</CardTitle>
        <CardDescription className="text-center">
          Regístrate para comenzar a usar MyMediaList
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Al menos 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-center">
          ¿Ya tienes una cuenta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            onClick={handleSwitchToLogin}
          >
            Inicia sesión
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}