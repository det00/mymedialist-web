"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import EstadoContenidoApi from "@/components/EstadoContenidoApi";
import { useEffect, useState } from "react";
import { SearchResult } from "@/lib/search";

interface CardSearchProps {
  item: SearchResult;
}

export function CardSearch({ item }: CardSearchProps) {
  const [estado, setEstado] = useState<string>(item.item?.estado || "");
  
  useEffect(() => {
    // Actualizar estado si cambia el item
    if (item.item?.estado) {
      setEstado(item.item.estado);
    }
  }, [item.item?.estado]);
  
  // Asegurarse de que las URLs de imagen sean válidas
  const imageUrl = item.imagen && item.imagen.startsWith("http") 
    ? item.imagen 
    : "https://via.placeholder.com/100x150";

  // Obtener la primera letra del tipo en mayúscula
  const tipoMayuscula = item.tipo?.toUpperCase().charAt(0) || 'P';

  return (
    <Card className="flex flex-row gap-4 p-4 max-w-xl mx-auto w-full shadow-background hover:shadow-md transition-shadow duration-200">
      <div className="relative h-30 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={item.titulo}
          width={80}
          height={120}
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-0 flex flex-col w-full justify-between">
        <CardTitle className="text-lg line-clamp-1">{item.titulo}</CardTitle>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.autor || 'Sin autor'}</p>
            <p className="text-sm text-muted-foreground italic line-clamp-2">
              {item.genero && item.genero.length > 0 ? item.genero.join(", ") : 'Sin género'}
            </p>
          </div>
          <div className="flex items-end">
            <EstadoContenidoApi 
              id_api={item.id_api}
              tipo={tipoMayuscula}
              estadoInicial={estado}
              onUpdateSuccess={() => console.log("Estado actualizado")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Exportación predeterminada para usar en importaciones
export default CardSearch;