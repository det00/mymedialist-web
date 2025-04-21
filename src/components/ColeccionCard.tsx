"use client";

import { Contenido } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

// Mapeo de tipos de contenido para la URL
const tipoAUrl: Record<string, string> = {
  "pelicula": "pelicula",
  "serie": "serie",
  "libro": "libro",
  "videojuego": "videojuego"
};

// Mapeo de códigos de estado a nombres legibles
const estadoANombre: Record<string, string> = {
  "C": "Completado",
  "E": "En progreso",
  "P": "Pendiente",
  "A": "Abandonado"
};

// Mapeo de códigos de estado a colores
const estadoAColor: Record<string, string> = {
  "C": "text-green-500",
  "E": "text-blue-500",
  "P": "text-amber-500",
  "A": "text-red-500"
};

// Mapeo de códigos de estado a colores de fondo
const estadoABgColor: Record<string, string> = {
  "C": "bg-green-500",
  "E": "bg-blue-500",
  "P": "bg-amber-500",
  "A": "bg-red-500"
};

interface ColeccionCardProps {
  item: Contenido;
}

export function ColeccionCard({ item }: ColeccionCardProps) {
  // Obtener el tipo de contenido para la URL
  const getTipoUrl = (item: Contenido): string => {
    const tipo = item.tipo?.toLowerCase() || "";
    return tipoAUrl[tipo] || "contenido";
  };
  
  // Mapeo de tipos para mostrar nombres legibles
  const getTipoNombre = (tipo?: string): string => {
    const tiposNombre: Record<string, string> = {
      "pelicula": "Película",
      "serie": "Serie",
      "libro": "Libro",
      "videojuego": "Videojuego"
    };
    
    if (!tipo) return "Contenido";
    return tiposNombre[tipo.toLowerCase()] || tipo;
  };

  // Obtener URL de imagen o placeholder
  const getImageUrl = (url?: string): string => {
    return url && url.startsWith("http") 
      ? url 
      : "https://via.placeholder.com/300x450";
  };

  // Obtener el año de lanzamiento
  const getAnioLanzamiento = (): string => {
    if (!item.fechaLanzamiento) return "";
    
    // Intentar extraer el año (admite formatos YYYY-MM-DD o solo YYYY)
    const coincidencia = item.fechaLanzamiento.match(/(\d{4})/);
    return coincidencia ? coincidencia[1] : "";
  };

  // Corrección: Obtener el estado directamente desde item.estado
  const estado = item.estado || "";

  return (
    <Link 
      href={`/${getTipoUrl(item)}/${item.id_api}`} 
      className="block cursor-pointer"
    >
      <div className="group relative flex flex-col h-full rounded-lg border overflow-hidden transition-all hover:shadow-md hover:border-primary">
        {/* Imagen */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
          <Image
            src={getImageUrl(item.imagen)}
            alt={item.titulo}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            priority={false}
          />
          {/* Indicador de estado */}
          {estado && (
            <div className="absolute bottom-2 right-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${estadoABgColor[estado]}`}>
              </div>
            </div>
          )}
        </div>
        
        {/* Información */}
        <div className="flex flex-col p-4">
          <h3 className="font-semibold text-sm line-clamp-1">{item.titulo}</h3>
          <p className="text-xs text-muted-foreground">
            {getTipoNombre(item.tipo)} {getAnioLanzamiento() && `· ${getAnioLanzamiento()}`}
          </p>
          {estado && (
            <div className={`text-xs mt-1 ${estadoAColor[estado]}`}>
              {estadoANombre[estado]}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}