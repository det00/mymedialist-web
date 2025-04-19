"use client";

import { Skeleton } from "./ui/skeleton";

export function ColeccionSkeleton() {
  // Crear una matriz de 8 elementos para mostrar 8 tarjetas de esqueleto
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {skeletonItems.map((item) => (
        <div key={item} className="flex flex-col rounded-lg border overflow-hidden">
          {/* Imagen */}
          <Skeleton className="aspect-[2/3] w-full" />
          
          {/* Contenido */}
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}