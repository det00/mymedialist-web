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

/**
 * Componente para gestionar el estado de un contenido (película, serie, libro, etc.)
 * Permite marcar como completado, en progreso, pendiente, abandonado o desmarcar
 */
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

  /*   useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]); */

  const getEstadoColor = () => {
    switch (estadoLocal) {
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
      console.log("ITEMIDLOCAL", itemIdLocal);
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
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
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
                  variant="outline"
                  className={`transition-all duration-200 relative ${buttonSize} cursor-pointer`}
                  style={{
                    boxShadow:
                      getEstadoColor() !== "gray"
                        ? `0 0 ${
                            isHovering ? "12px" : "8px"
                          } ${getEstadoColor()}`
                        : isHovering
                        ? "0 0 5px rgba(0,0,0,0.2)"
                        : "none",
                    transform: isHovering ? "scale(1.05)" : "scale(1)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onClick={handleClick}
                  disabled={loading}
                >
                  <Tag
                    color={getEstadoColor()}
                    className={`transition-transform duration-200 ${iconSize} ${
                      isHovering ? "scale-110" : ""
                    }`}
                  />
                  {success && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-background animate-pulse"></span>
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
