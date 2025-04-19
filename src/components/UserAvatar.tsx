"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarData: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function UserAvatar({ avatarData, size = "md", className = "" }: UserAvatarProps) {
  // Determinar si es un avatar predefinido o de iniciales
  const isPredefined = !avatarData.startsWith("initial_");
  
  // Obtener información del avatar de iniciales si es el caso
  let avatarColor = "#6C5CE7"; // Color predeterminado
  let userInitials = "US"; // Iniciales predeterminadas
  
  if (!isPredefined && avatarData) {
    const parts = avatarData.split("_");
    if (parts.length >= 3) {
      avatarColor = parts[1];
      userInitials = parts[2];
    }
  }
  
  // Determinar la clase de tamaño
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  }[size];
  
  // Determinar la clase de tamaño de texto para las iniciales
  const textSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-xl",
    xl: "text-2xl"
  }[size];
  
  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {isPredefined ? (
        <>
          <AvatarImage src={`/avatars/${avatarData}.png`} alt="Avatar de usuario" />
          <AvatarFallback>US</AvatarFallback>
        </>
      ) : (
        <AvatarFallback 
          style={{ backgroundColor: avatarColor }}
          className={`text-white font-medium ${textSizeClass}`}
        >
          {userInitials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}