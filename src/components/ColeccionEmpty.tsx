"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LibraryIcon, SearchIcon } from "lucide-react";

interface ColeccionEmptyProps {
  filtroActivo: boolean;
}

export function ColeccionEmpty({ filtroActivo }: ColeccionEmptyProps) {
  return (
    <div className="flex flex-col justify-center items-center py-16 px-4 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <LibraryIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">
        {filtroActivo 
          ? "No hay contenido con estos filtros" 
          : "Tu colección está vacía"}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {filtroActivo 
          ? "Prueba a cambiar los filtros para ver más contenido o añade nuevo contenido a tu colección." 
          : "Empieza a añadir películas, series, libros y juegos para construir tu colección personal."}
      </p>
      
      <Link href="/busqueda?busqueda=&tipo=P">
        <Button className="gap-2">
          <SearchIcon className="h-4 w-4" />
          Explorar contenido
        </Button>
      </Link>
    </div>
  );
}