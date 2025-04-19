"use client";

import { Contenido } from "@/lib/types";
import { ColeccionCard } from "./ColeccionCard";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ColeccionGroupProps {
  title: string;
  contenido: Contenido[];
  verMasUrl?: string;
  limite?: number;
}

export function ColeccionGroup({ 
  title, 
  contenido, 
  verMasUrl,
  limite = 4 
}: ColeccionGroupProps) {
  // Si no hay contenido, no mostramos nada
  if (contenido.length === 0) {
    return null;
  }
  
  // Limitar el número de elementos a mostrar
  const contenidoLimitado = contenido.slice(0, limite);
  const tieneVerMas = contenido.length > limite && verMasUrl;
  
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {tieneVerMas && (
          <Link href={verMasUrl}>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todos <span className="text-muted-foreground">({contenido.length})</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {contenidoLimitado.map((item) => (
          <div key={`${item.id_api}-${item.tipo}`}>
            <ColeccionCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}