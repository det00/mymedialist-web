"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

// Lista de avatares predefinidos
const predefinedAvatars = [
  { id: "avatar1", src: "/avatars/avatar1.svg", alt: "Avatar 1" },
  { id: "avatar2", src: "/avatars/avatar2.svg", alt: "Avatar 2" },
  { id: "avatar3", src: "/avatars/avatar3.svg", alt: "Avatar 3" },
  { id: "avatar4", src: "/avatars/avatar4.svg", alt: "Avatar 4" },
  { id: "avatar5", src: "/avatars/avatar5.svg", alt: "Avatar 5" },
  { id: "avatar6", src: "/avatars/avatar6.svg", alt: "Avatar 6" },
  { id: "avatar7", src: "/avatars/avatar7.svg", alt: "Avatar 7" },
  { id: "avatar8", src: "/avatars/avatar8.svg", alt: "Avatar 8" },
];

// Colores predefinidos para avatares de iniciales con nombres
const avatarColors = [
  { id: "purple", value: "#6C5CE7", name: "Púrpura" },
  { id: "pink", value: "#E84393", name: "Rosa" },
  { id: "green", value: "#00B894", name: "Verde" },
  { id: "yellow", value: "#FDCB6E", name: "Amarillo" },
  { id: "red", value: "#FF7675", name: "Rojo" },
  { id: "blue", value: "#0984E3", name: "Azul" },
  { id: "teal", value: "#00CEC9", name: "Turquesa" },
  { id: "lightpink", value: "#FD79A8", name: "Rosa claro" },
];

export function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  // Determinar el tipo de avatar inicialmente seleccionado
  const initialTab = selectedAvatar.startsWith("initial_") ? "initials" : "predefined";
  
  // Estado para controlar qué tipo de avatar está seleccionado actualmente
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  // Extraer información del avatar de iniciales si está seleccionado
  const initials = selectedAvatar.startsWith("initial_") 
    ? selectedAvatar.split("_")[2] || "US" 
    : "US";
  
  const initialColor = selectedAvatar.startsWith("initial_") 
    ? selectedAvatar.split("_")[1] || avatarColors[0].value 
    : avatarColors[0].value;

  // Estados para manejar las iniciales y el color seleccionado
  const [userInitials, setUserInitials] = useState<string>(initials);
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  
  // Manejar selección de avatar predefinido
  const handleSelectPredefined = (avatarId: string) => {
    onSelectAvatar(avatarId);
  };
  
  // Manejar cambios en las iniciales
  const handleInitialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limitar a 2 caracteres y convertir a mayúsculas
    const newInitials = e.target.value.toUpperCase().slice(0, 2);
    setUserInitials(newInitials);
    onSelectAvatar(`initial_${selectedColor}_${newInitials || "US"}`);
  };
  
  // Manejar selección de color
  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue);
    onSelectAvatar(`initial_${colorValue}_${userInitials || "US"}`);
  };
  
  // Manejar cambio de pestaña
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "predefined") {
      // Si cambia a avatares predefinidos y no hay uno seleccionado, seleccionar el primero
      if (!predefinedAvatars.some(avatar => avatar.id === selectedAvatar)) {
        handleSelectPredefined(predefinedAvatars[0].id);
      }
    } else {
      // Si cambia a iniciales, generar el formato de avatar de iniciales
      onSelectAvatar(`initial_${selectedColor}_${userInitials}`);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="predefined">Avatares</TabsTrigger>
          <TabsTrigger value="initials">Iniciales</TabsTrigger>
        </TabsList>
        
        {/* Contenido de avatares predefinidos */}
        <TabsContent value="predefined" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            {predefinedAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`cursor-pointer p-2 rounded-md transition-all flex flex-col items-center ${
                  selectedAvatar === avatar.id
                    ? "bg-primary/20 scale-105"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectPredefined(avatar.id)}
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                  <AvatarFallback>...</AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Contenido de avatares de iniciales */}
        <TabsContent value="initials" className="space-y-6">
          {/* Vista previa del avatar con iniciales */}
          <div className="flex justify-center py-4">
            <Avatar className="h-24 w-24" style={{ backgroundColor: selectedColor }}>
              <AvatarFallback className="text-2xl font-bold text-white">
                {userInitials || "US"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Input para las iniciales */}
          <div className="space-y-2">
            <Label htmlFor="initials">Tus iniciales (máx. 2 caracteres)</Label>
            <Input
              id="initials"
              value={userInitials}
              onChange={handleInitialsChange}
              placeholder="Ej: AB"
              maxLength={2}
              className="w-full"
            />
          </div>
          
          {/* Selección de color */}
          <div className="space-y-2">
            <Label>Color de fondo</Label>
            <RadioGroup 
              defaultValue={selectedColor}
              onValueChange={handleColorChange}
              className="grid grid-cols-4 gap-2"
            >
              {avatarColors.map((color) => (
                <div key={color.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={color.value}
                    id={color.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={color.id}
                    className="flex flex-col items-center space-y-2 cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === color.value
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}