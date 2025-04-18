"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import EstadoContenido from "./EstadoContenido";
import { useEffect, useState } from "react";
import { Buscar } from "@/lib/types";
import api from "@/lib/axios";

interface ItemSearchScreenProps {
  item: Buscar;
}

const CardSearch: React.FC<ItemSearchScreenProps> = ({ item }) => {
  const [estado, setEstado] = useState<string>("");
  
  useEffect(() => {
    console.log("Estado actualizado:", estado);
    
    // Aquí podrías implementar una lógica para guardar el estado en la API
    if (estado && item.id_api) {
      const updateEstado = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          
          // Determinar el tipo basado en la propiedad item.tipo o inferirlo de otra manera
          const tipo = item.tipo || "P"; // Valor por defecto
          
          await api.post("/estado", {
            id_api: item.id_api,
            tipo,
            estado
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log("Estado guardado correctamente");
        } catch (error) {
          console.error("Error al guardar el estado:", error);
        }
      };
      
      // Descomenta esto cuando tengas la API lista
      // updateEstado();
    }
  }, [estado, item.id_api, item.tipo]);

  // Asegurarse de que las URLs de imagen sean válidas
  const imageUrl = item.imagen && item.imagen.startsWith("http") 
    ? item.imagen 
    : "https://via.placeholder.com/100x150";

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
            <EstadoContenido estado={estado} setEstado={setEstado} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CardSearch;