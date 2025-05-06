"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { AvatarSelector } from "@/components/AvatarSelector";
import { authService } from "@/lib/auth";

interface RegisterFormProps {
  showRegistro: (value: boolean) => void;
  showLogin: () => void;
}

export function RegisterForm({ showRegistro, showLogin }: RegisterFormProps) {
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("avatar1");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1); // 1: datos básicos, 2: datos personales, 3: avatar

  // Registrar usuario con el backend
  const registrarUsuario = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Registrar usuario con el servicio de autenticación
      const response = await authService.register(
        username,
        name,
        email,
        password,
        bio,
        avatar
      );
      
      // Verificar si hubo errores específicos
      if (response.message === "email") {
        setError("El email ya está registrado");
        return false;
      }
      
      if (response.message === "username") {
        setError("El nombre de usuario ya está en uso");
        return false;
      }
      
      if (response.message === "password") {
        setError("La contraseña no cumple con los requisitos");
        return false;
      }
      
      if (response.message && response.message !== "") {
        setError(`Error en el registro: ${response.message}`);
        return false;
      }
      
      // Iniciar sesión directamente
      await authService.login(email, password);
      
      // Guardar avatar
      authService.setUserAvatar(avatar);
      
      return true;
    } catch (error: any) {
      console.error("Error en registro:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message);
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

  const handleNextStep = () => {
    if (step === 1) {
      // Validaciones del paso 1
      if (!username || !email || !password || !confirmPassword) {
        setError("Por favor, completa todos los campos obligatorios");
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
      
      // Validación simple de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor, introduce un email válido");
        return;
      }
      
      // Validación de username
      if (username.length < 3) {
        setError("El nombre de usuario debe tener al menos 3 caracteres");
        return;
      }
    }
    
    // Si todas las validaciones pasan, avanzar al siguiente paso
    setError(null);
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await registrarUsuario();
    
    if (success) {
      // Cerrar el modal
      showRegistro(false);
      
      // Recargar la página
      window.location.reload();
    }
  };

  const handleSwitchToLogin = () => {
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
          {step === 1 
            ? "Crea tu cuenta en MyMediaList" 
            : step === 2
            ? "Completa tu perfil"
            : "Elige tu avatar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            // Paso 1: Información básica de cuenta
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario *</Label>
                <Input
                  id="username"
                  placeholder="ej: usuario123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="password">Contraseña *</Label>
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
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
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
                type="button" 
                className="w-full" 
                disabled={loading}
                onClick={handleNextStep}
              >
                Continuar
              </Button>
            </>
          ) : step === 2 ? (
            // Paso 2: Información personal
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  placeholder="Nombre Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  placeholder="Cuéntanos sobre ti... (ej: Me gusta el cine y los videojuegos)"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={loading}
                  className="min-h-[80px]"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-1/2" 
                  disabled={loading}
                  onClick={handlePreviousStep}
                >
                  Atrás
                </Button>
                <Button 
                  type="button" 
                  className="w-1/2" 
                  disabled={loading}
                  onClick={handleNextStep}
                >
                  Continuar
                </Button>
              </div>
            </>
          ) : (
            // Paso 3: Selección de avatar
            <>
              <AvatarSelector 
                selectedAvatar={avatar} 
                onSelectAvatar={setAvatar} 
              />
              
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-1/2" 
                  disabled={loading}
                  onClick={handlePreviousStep}
                >
                  Atrás
                </Button>
                <Button 
                  type="submit" 
                  className="w-1/2" 
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </div>
            </>
          )}
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