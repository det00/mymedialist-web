"use client";

import React, { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import collectionService from "@/lib/collection";

interface EstadoContenidoApiProps {
  id_api: string;
  tipo: string;
  estado: string;
  itemId: number;
  onUpdateSuccess?: () => void;
  size?: "sm" | "md" | "lg";
}

const EstadoContenidoApi: React.FC<EstadoContenidoApiProps> = ({
  id_api,
  tipo,
  estado,
  itemId,
  onUpdateSuccess,
  size = "md",
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [estadoLocal, setEstadoLocal] = useState<string>(estado);
  const [itemIdLocal, setItemIdLocal] = useState<number>(itemId);

  useEffect(() => {
    setEstadoLocal(estado);
    setItemIdLocal(itemId);
  }, [estado, itemId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const getEstadoColor = () => {
    switch (estadoLocal) {
      case "C":
        return "#10b981"; // Emerald-500
      case "E":
        return "#3b82f6"; // Blue-500
      case "P":
        return "#f59e0b"; // Amber-500
      case "A":
        return "#ef4444"; // Red-500
      default:
        return "#6b7280"; // Gray-500
    }
  };
  
  const getEstadoBgColor = () => {
    switch (estadoLocal) {
      case "C":
        return "rgba(16, 185, 129, 0.1)"; // Emerald con transparencia
      case "E":
        return "rgba(59, 130, 246, 0.1)"; // Blue con transparencia
      case "P":
        return "rgba(245, 158, 11, 0.1)"; // Amber con transparencia
      case "A":
        return "rgba(239, 68, 68, 0.1)"; // Red con transparencia
      default:
        return "transparent";
    }
  };

  const getEstadoNombre = () => {
    switch (estadoLocal) {
      case "C":
        return "Completado";
      case "E":
        return "En progreso";
      case "P":
        return "Pendiente";
      case "A":
        return "Abandonado";
      default:
        return "Sin estado";
    }
  };

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (nuevoEstado === estadoLocal) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    setEstadoLocal(nuevoEstado);

    if (nuevoEstado === "") {
      await collectionService.removeFromCollection(itemIdLocal);
      setItemIdLocal(-1);
    } else if (estadoLocal !== "" && itemIdLocal !== -1) {
      await collectionService.updateItem(itemIdLocal, nuevoEstado);
    } else {
      const res = await collectionService.addToCollection(
        id_api,
        tipo,
        nuevoEstado
      );
      setItemIdLocal(res.id);
    }
    setLoading(false);
    setSuccess(true);
    
    // Emitir evento de actualización de estado
    const event = new CustomEvent('contentStateUpdated', {
      detail: {
        id_api: id_api,
        tipo: tipo,
        estado: nuevoEstado
      }
    });
    window.dispatchEvent(event);
    
    if (onUpdateSuccess) {
      onUpdateSuccess();
    }
  };

  // Evitar propagación de eventos
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Configurar tamaños según la prop size
  const buttonSize = {
    sm: "h-8",
    md: "h-9",
    lg: "h-10",
  }[size];
  
  const buttonPadding = {
    sm: "xl:px-3",
    md: "xl:px-4",
    lg: "xl:px-5",
  }[size];

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  return (
    <TooltipProvider>
      <div
        onClick={handleClick}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={estadoLocal ? "default" : "outline"}
                  className={`transition-all duration-300 relative ${buttonSize} ${buttonPadding} cursor-pointer overflow-hidden rounded-full flex items-center ${!estadoLocal ? 'px-0 justify-center xl:justify-start xl:px-2' : 'px-2 justify-center xl:justify-start'} gap-2`}
                  style={{
                    backgroundColor: getEstadoBgColor(),
                    borderColor: getEstadoColor(),
                    borderWidth: estadoLocal ? "2px" : "1px",
                    transform: isHovering ? "scale(1.03)" : "scale(1)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onClick={handleClick}
                  disabled={loading}
                >
                  <Tag
                    style={{ color: getEstadoColor() }}
                    className={`transition-transform duration-300 ${iconSize} flex-shrink-0 ${
                      isHovering ? "scale-110" : ""
                    }`}
                  />
                  {estadoLocal && (
                    <span 
                      className="text-xs font-medium truncate hidden xl:inline"
                      style={{ color: getEstadoColor() }}
                    >
                      {getEstadoNombre()}
                    </span>
                  )}
                  {estadoLocal && (
                    <span 
                      className="absolute inset-0 opacity-20 rounded-full" 
                      style={{ backgroundColor: getEstadoColor() }}
                    ></span>
                  )}
                  {success && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-background animate-ping"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50" onClick={handleClick}>
                <DropdownMenuLabel>Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={estadoLocal || ""}>
                  <DropdownMenuRadioItem
                    value="C"
                    className="cursor-pointer"
                    onSelect={() => handleEstadoChange("C")}
                  >
                    Terminado
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="E"
                    className="cursor-pointer"
                    onSelect={() => handleEstadoChange("E")}
                  >
                    En progreso
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="P"
                    className="cursor-pointer"
                    onSelect={() => handleEstadoChange("P")}
                  >
                    Pendiente
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="A"
                    className="cursor-pointer"
                    onSelect={() => handleEstadoChange("A")}
                  >
                    Abandonado
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value=""
                    className="cursor-pointer"
                    onSelect={() => handleEstadoChange("")}
                  >
                    Desmarcar
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getEstadoNombre()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default EstadoContenidoApi;
