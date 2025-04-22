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

interface EstadoContenidoProps {
  estado: string;
  setEstado: (newEstado: string) => void;
}

const EstadoContenido: React.FC<EstadoContenidoProps> = ({
  estado,
  setEstado,
}) => {
  const [open, setOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  useEffect(() => {
    console.log("ESTADOCOMPONENTE", estado);
  }, [estado]);

  // Maneja la selección de un estado, cierra el dropdown y detiene la propagación
  const handleEstadoChange = (newEstado: string) => {
    setEstado(newEstado);
    setOpen(false); // Cierra el dropdown después de seleccionar
  };

  // Detener la propagación en todo el componente
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="transition-all duration-200 relative"
            style={{
              boxShadow: colorEstado() !== "gray" 
                ? `0 0 ${isHovering ? '12px' : '8px'} ${colorEstado()}` 
                : isHovering ? '0 0 5px rgba(0,0,0,0.2)' : 'none',
              transform: isHovering ? 'scale(1.05)' : 'scale(1)',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Tag 
              color={colorEstado()} 
              className={`transition-transform duration-200 ${isHovering ? 'scale-110' : ''}`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 z-50" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Estado</DropdownMenuLabel>
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
    </div>
  );
};

export default EstadoContenido;