"use client";

import { Contenido } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface ColeccionStatsProps {
  coleccion: Contenido[];
}

export function ColeccionStats({ coleccion }: ColeccionStatsProps) {
  // Función para contar elementos por tipo
  const contarPorTipo = () => {
    const contador: Record<string, number> = {
      pelicula: 0,
      serie: 0,
      libro: 0,
      videojuego: 0
    };
    
    coleccion.forEach(item => {
      const tipo = item.tipo?.toLowerCase();
      if (tipo && contador[tipo] !== undefined) {
        contador[tipo]++;
      }
    });
    
    return contador;
  };
  
  // Función para contar elementos por estado
  const contarPorEstado = () => {
    return {
      completados: coleccion.filter(item => item.item?.estado === 'C').length,
      enProgreso: coleccion.filter(item => item.item?.estado === 'E').length,
      pendientes: coleccion.filter(item => item.item?.estado === 'P').length,
      abandonados: coleccion.filter(item => item.item?.estado === 'A').length
    };
  };
  
  const tiposCantidad = contarPorTipo();
  const estadosCantidad = contarPorEstado();
    
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Resumen de Colección</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Por tipo */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Por tipo</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Películas</span>
                <span className="text-sm font-semibold">{tiposCantidad.pelicula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Series</span>
                <span className="text-sm font-semibold">{tiposCantidad.serie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Libros</span>
                <span className="text-sm font-semibold">{tiposCantidad.libro}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Juegos</span>
                <span className="text-sm font-semibold">{tiposCantidad.videojuego}</span>
              </div>
            </div>
          </div>
          
          {/* Por estado */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Por estado</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Completados</span>
                <span className="text-sm font-semibold text-green-500">{estadosCantidad.completados}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">En progreso</span>
                <span className="text-sm font-semibold text-blue-500">{estadosCantidad.enProgreso}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pendientes</span>
                <span className="text-sm font-semibold text-amber-500">{estadosCantidad.pendientes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Abandonados</span>
                <span className="text-sm font-semibold text-red-500">{estadosCantidad.abandonados}</span>
              </div>
            </div>
          </div>
          
          {/* Estadísticas generales */}
          <div className="space-y-2 col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground">Estadísticas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold">{coleccion.length}</span>
                <span className="text-xs text-muted-foreground">Total en colección</span>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <span className="block text-2xl font-bold text-primary">
                  {Math.round((estadosCantidad.completados / coleccion.length) * 100) || 0}%
                </span>
                <span className="text-xs text-muted-foreground">Completados</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}