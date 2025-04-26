"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import EstadoContenidoApi from "@/components/EstadoContenidoApi";
import { Badge } from "./ui/badge";
import { Film, Gamepad2, Library, Tv } from "lucide-react";
import type { CardBasic } from "@/lib/types";

const CardSearch: React.FC<CardBasic> = ({
  id,
  id_api,
  tipo,
  titulo,
  autor,
  genero,
  imagen,
  estado,
}) => {
  const tipoInfo = {
    P: { nombre: "Película", icon: Film },
    S: { nombre: "Serie", icon: Tv },
    L: { nombre: "Libro", icon: Library },
    V: { nombre: "Videojuego", icon: Gamepad2 },
  };

  const renderContentTypeIcon = (tipo: string) => {
    const Icon = tipoInfo[tipo as keyof typeof tipoInfo]?.icon || Film;
    return <Icon className="h-4 w-4" />;
  };

  // Asegurarse de que las URLs de imagen sean válidas
  const imageUrl =
    imagen && imagen.startsWith("http")
      ? imagen
      : "https://via.placeholder.com/100x150";

  // Obtener la primera letra del tipo en mayúscula
  const tipoMayuscula = tipo.toUpperCase().charAt(0) || "P";

  return (
    <Card className="flex flex-row gap-4 p-4 max-w-xl mx-auto w-full shadow-background hover:shadow-md transition-shadow duration-200">
      <div className="relative h-30 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={titulo}
          width={80}
          height={120}
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-0 flex flex-col w-full justify-between">
        <CardTitle className="text-lg line-clamp-1">{titulo}</CardTitle>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {autor || "Sin autor"}
            </p>
            <p className="flex flex-wrap gap-1 mt-2">
              {genero?.slice(0, 2).map((gen, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {gen}
                </Badge>
              ))}
            </p>
            <div className="flex justify-between items-center mt-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {renderContentTypeIcon(tipo)}
                {tipoInfo[tipo as keyof typeof tipoInfo]?.nombre}
              </Badge>
            </div>
          </div>
          <div className="flex items-end">
            <EstadoContenidoApi
              id_api={String(id_api)}
              tipo={tipoMayuscula}
              estado={estado ?? ""}
              onUpdateSuccess={() => console.log("Estado actualizado")}
              size="sm"
              itemId={id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default CardSearch;
