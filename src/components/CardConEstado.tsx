"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EstadoContenidoButton from "./EstadoContenidoButton";
import { Film, Tv, BookOpen, Gamepad2 } from "lucide-react";

interface ContenidoItem {
  id?: string;
  id_api: string;
  tipo: string;
  imagen?: string;
  titulo: string;
  autor?: string;
  genero?: string[];
  estado?: string;
  item?: {
    id: string;
    estado: string;
  };
}

interface CardConEstadoProps {
  item: ContenidoItem;
  onClick?: () => void;
}

export function CardConEstado({ item, onClick }: CardConEstadoProps) {
  // Obtener ruta a la página de detalle
  const getItemRoute = () => {
    let rutaTipo = "";
    
    switch (item.tipo) {
      case "P":
        rutaTipo = "pelicula";
        break;
      case "S":
        rutaTipo = "serie";
        break;
      case "L":
        rutaTipo = "libro";
        break;
      case "V":
        rutaTipo = "videojuego";
        break;
      default:
        rutaTipo = "contenido";
    }
    
    return `/${rutaTipo}/${item.id_api}`;
  };
  
  // Renderizar icono basado en tipo de contenido
  const renderContentTypeIcon = () => {
    switch (item.tipo) {
      case "P":
        return <Film className="h-4 w-4" />;
      case "S":
        return <Tv className="h-4 w-4" />;
      case "L":
        return <BookOpen className="h-4 w-4" />;
      case "V":
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };
  
  // Obtener nombre del tipo
  const getTypeName = () => {
    switch (item.tipo) {
      case "P":
        return "Película";
      case "S":
        return "Serie";
      case "L":
        return "Libro";
      case "V":
        return "Videojuego";
      default:
        return "Contenido";
    }
  };
  
  // Obtener imagen válida o placeholder
  const imageUrl = item.imagen && (item.imagen.startsWith("http") || item.imagen.startsWith("/"))
    ? item.imagen
    : "https://via.placeholder.com/300x450";
  
  // Obtener estado desde el objeto item o directamente
  const estado = item.item?.estado || item.estado || "";

  return (
    <Link href={getItemRoute()} onClick={onClick} className="cursor-pointer">
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex h-full">
          <div className="w-1/3 relative">
            <Image
              src={imageUrl}
              alt={item.titulo}
              fill
              className="object-cover"
            />
            {/* Posicionamos el botón de estado en la esquina inferior derecha de la imagen */}
            <div className="absolute bottom-2 right-2" onClick={(e) => e.stopPropagation()}>
              <EstadoContenidoButton
                id_api={item.id_api}
                tipo={item.tipo}
                estadoInicial={estado}
                variant="icon"
                stopPropagation={true}
              />
            </div>
          </div>
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold line-clamp-2">{item.titulo}</h3>
              <p className="text-sm text-muted-foreground">
                {item.autor}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.genero?.slice(0, 2).map((gen, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs"
                  >
                    {gen}
                  </Badge>
                ))}
                {item.genero && item.genero.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.genero.length - 2}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1"
              >
                {renderContentTypeIcon()}
                {getTypeName()}
              </Badge>
              
              {/* Aquí podemos usar la versión de Badge del componente */}
              <div onClick={(e) => e.stopPropagation()}>
                <EstadoContenidoButton
                  id_api={item.id_api}
                  tipo={item.tipo}
                  estadoInicial={estado}
                  variant="badge"
                  compact={true}
                  stopPropagation={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}