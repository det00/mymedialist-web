"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarData?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  tabAction?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarData,
  size = "md",
  className,
  onClick,
  tabAction
}) => {
  const router = useRouter();

  // Valores por defecto
  if (!avatarData) {
    avatarData = "avatar1";
  }

  // Forzar la evaluación del formato de avatar en cada renderizado
  // Determinar si es un avatar predefinido o de iniciales
  const isPredefined = avatarData.startsWith("avatar") || 
                       (avatarData.includes("/avatars/") && avatarData.endsWith(".png")) ||
                       (avatarData.includes("/avatars/") && avatarData.endsWith(".svg"));
  
  // Obtener color y iniciales si es avatar de iniciales
  let avatarColor = "#6C5CE7"; // Color predeterminado
  let userInitials = "US"; // Iniciales predeterminadas
  
  if (!isPredefined && avatarData.startsWith("initial_")) {
    const parts = avatarData.split("_");
    if (parts.length >= 3) {
      avatarColor = parts[1];
      userInitials = parts[2];
    }
  }
  
  // Loguear para debug
  // console.log(`Rendering avatar: ${avatarData}, isPredefined: ${isPredefined}`);
  // if (!isPredefined) {
  //   console.log(`Initial avatar: color=${avatarColor}, initials=${userInitials}`);
  // }
  
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
  
  // Construir ruta de avatar predefinido
  const predefinedAvatarPath = isPredefined 
    ? (avatarData.startsWith("avatar") 
        ? `/avatars/${avatarData}.svg` 
        : avatarData)
    : "";
  
  return (
    <Avatar className={`${sizeClass} ${className}`} onClick={() => {
        if (tabAction === "profile") {
          router.push("/perfil");
        }
        if (onClick) {
          onClick();
        }
      }}>
      {isPredefined ? (
        <>
          <AvatarImage 
            src={predefinedAvatarPath} 
            alt="Avatar de usuario" 
            className="object-cover"
          />
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