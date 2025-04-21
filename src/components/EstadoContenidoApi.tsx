"use client";

import { useEffect, useState } from "react";
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
import { homeService } from "@/lib/home";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EstadoContenidoApiProps {
  id_api: string;
  tipo: string;
  estadoInicial: string;
  itemId?: string; // ID del elemento en la colección (si ya existe)
  onUpdateSuccess?: () => void;
  size?: "sm" | "md" | "lg";
}

const EstadoContenidoApi: React.FC<EstadoContenidoApiProps> = ({
  id_api,
  tipo,
  estadoInicial,
  itemId,
  onUpdateSuccess,
  size = "md"
}) => {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [estado, setEstado] = useState(estadoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const colorEstado = () => {
    switch (estado) {
      case "C":
        return "green";
      case "E":
        return "blue";
      case "P":
        return "yellow";
      case "A":
        return "red";
      default:
        return "gray";
    }
  };

  // Obtener color más claro para el hover
  const hoverColorEstado = () => {
    switch (estado) {
      case "C":
        return "#22c55e"; // verde
      case "E":
        return "#3b82f6"; // azul
      case "P":
        return "#eab308"; // amarillo
      case "A":
        return "#ef4444"; // rojo
      default:
        return "#94a3b8"; // gris
    }
  };

  // Obtener nombre del estado para el tooltip
  const getNombreEstado = () => {
    switch (estado) {
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

  useEffect(() => {
    if (estadoInicial !== estado) {
      setEstado(estadoInicial);
    }
  }, [estadoInicial]);

  // Efecto para mostrar mensaje de éxito brevemente
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Maneja la selección de un estado, cierra el dropdown y detiene la propagación
  const handleEstadoChange = async (newEstado: string) => {
    if (newEstado === estado) {
      setOpen(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Guardar estado anterior para posible reversión
      const estadoAnterior = estado;
      
      // Actualizar estado en UI inmediatamente para feedback rápido
      setEstado(newEstado);
      setOpen(false);
      
      // Usamos el método de homeService que sabemos que funciona
      // para actualizar el estado del contenido
      await homeService.updateItemState(id_api, tipo, newEstado);
      
      // Mostrar indicador de éxito
      setSuccess(true);
      
      // Si hay callback de éxito, ejecutarlo
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setError("Error al actualizar estado");
      
      // Revertir a estado anterior en caso de error
      setEstado(estado);
    } finally {
      setLoading(false);
    }
  };

  // Detener la propagación en todo el componente
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Tamaño del botón según la prop size
  const buttonSize = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10"
  }[size];

  // Tamaño del icono según la prop size
  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
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
                  variant="outline"
                  className={`transition-all duration-200 relative ${buttonSize}`}
                  style={{
                    boxShadow: colorEstado() !== "gray" 
                      ? `0 0 ${isHovering ? '12px' : '8px'} ${colorEstado()}` 
                      : isHovering ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
                    transform: isHovering ? 'scale(1.05)' : 'scale(1)',
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: loading ? 0.7 : 1
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled={loading}
                >
                  <Tag 
                    color={colorEstado()} 
                    className={`transition-transform duration-200 ${iconSize} ${isHovering ? 'scale-110' : ''}`}
                  />
                  {success && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-background animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel>Estado</DropdownMenuLabel>
                {error && (
                  <div className="px-2 py-1 my-1 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={estado}>
                  <DropdownMenuRadioItem 
                    value="C" 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEstadoChange("C");
                    }}
                  >
                    Terminado
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="E" 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEstadoChange("E");
                    }}
                  >
                    En progreso
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="P" 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEstadoChange("P");
                    }}
                  >
                    Pendiente
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="A" 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEstadoChange("A");
                    }}
                  >
                    Abandonado
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem 
                    value="" 
                    className="cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleEstadoChange("");
                    }}
                  >
                    Desmarcar
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getNombreEstado()}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default EstadoContenidoApi;