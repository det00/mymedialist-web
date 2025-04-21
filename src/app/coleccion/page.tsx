"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contenido } from "@/lib/types";
import { Circle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { ColeccionSkeleton } from "@/components/ColeccionSkeleton";
import { ColeccionCard } from "@/components/ColeccionCard";
import { ColeccionStats } from "@/components/ColeccionStats";
import { ColeccionEmpty } from "@/components/ColeccionEmpty";
import { ColeccionSort, type SortOption } from "@/components/ColeccionSort";
import { ColeccionIntro } from "@/components/ColeccionIntro";
import { ColeccionGroup } from "@/components/ColeccionGroup";
import { collectionService } from "@/lib/collection";
import { authService } from "@/lib/auth";
import { AlertCircle } from "lucide-react";

// Define los tipos de filtro para la colección
type TipoFiltro = "todo" | "pelicula" | "serie" | "libro" | "videojuego";
type EstadoFiltro = "todo" | "C" | "E" | "P" | "A";

export default function ColeccionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Verificar autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Leer filtros de la URL
  const tipoParam = searchParams.get("tipo") as TipoFiltro | null;
  const estadoParam = searchParams.get("estado") as EstadoFiltro | null;
  const sortParam = searchParams.get("ordenar") as SortOption | null;
  
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>(tipoParam && ["pelicula", "serie", "libro", "videojuego"].includes(tipoParam) ? tipoParam : "todo");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>(estadoParam && ["C", "E", "P", "A"].includes(estadoParam) ? estadoParam : "todo");
  const [coleccion, setColeccion] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(sortParam && ["title_asc", "title_desc", "date_desc", "date_asc", "rating_desc"].includes(sortParam) ? sortParam : "title_asc");

  // Verificar autenticación al cargar
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Función para actualizar la URL con los filtros actuales
  const actualizarUrl = (tipo: TipoFiltro, estado: EstadoFiltro, sort: SortOption) => {
    const params = new URLSearchParams();
    
    if (tipo !== "todo") {
      params.set("tipo", tipo);
    }
    
    if (estado !== "todo") {
      params.set("estado", estado);
    }
    
    if (sort !== "title_asc") {
      params.set("ordenar", sort);
    }
    
    const nuevaUrl = params.toString() ? `?${params.toString()}` : "";
    router.push(nuevaUrl, { scroll: false });
  };
  
  // Manejadores para cambiar los filtros
  const cambiarTipoFiltro = (nuevoTipo: TipoFiltro) => {
    setTipoFiltro(nuevoTipo);
    actualizarUrl(nuevoTipo, estadoFiltro, sortOption);
  };
  
  const cambiarEstadoFiltro = (nuevoEstado: EstadoFiltro) => {
    setEstadoFiltro(nuevoEstado);
    actualizarUrl(tipoFiltro, nuevoEstado, sortOption);
  };
  
  const cambiarSortOption = (nuevoSort: SortOption) => {
    setSortOption(nuevoSort);
    actualizarUrl(tipoFiltro, estadoFiltro, nuevoSort);
  };
  
  // Función para limpiar los filtros
  const limpiarFiltros = () => {
    setTipoFiltro("todo");
    setEstadoFiltro("todo");
    setSortOption("title_asc");
    router.push("", { scroll: false });
  };

  // Obtener la colección del usuario
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const obtenerColeccion = async () => {
      try {
        setLoading(true);
        
        // Crear objeto de filtros para la API
        const filters: any = {};
        
        // Convierte el tipo de filtro a formato de API
        if (tipoFiltro !== "todo") {
          // Obtener la primera letra del tipo en mayúscula
          filters.tipo = tipoFiltro.charAt(0).toUpperCase();
        }
        
        // Usa el filtro de estado directamente
        if (estadoFiltro !== "todo") {
          filters.estado = estadoFiltro;
        }
        
        // Obtener colección filtrada
        const resultado = await collectionService.getUserCollection(filters);
        setColeccion(resultado);
        setError(null);
      } catch (err) {
        console.error("Error al obtener la colección:", err);
        setError("No se pudo cargar tu colección");
      } finally {
        setLoading(false);
      }
    };

    obtenerColeccion();
  }, [isAuthenticated, tipoFiltro, estadoFiltro]);

  // Filtrar la colección según los filtros seleccionados
  const contenidoFiltrado = coleccion
    .filter((item) => {
      // Ya filtramos por tipo y estado en la API, esto es solo para refinamiento adicional
      return true;
    })
    .sort((a, b) => {
      // Ordenamiento según la opción seleccionada
      switch (sortOption) {
        case "title_asc":
          return a.titulo.localeCompare(b.titulo);
        case "title_desc":
          return b.titulo.localeCompare(a.titulo);
        case "date_desc":
          // Extraer años para comparar (asumiendo formato YYYY-MM-DD o año como string)
          const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearB) - parseInt(yearA);
        case "date_asc":
          const yearAsc1 = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearAsc2 = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearAsc1) - parseInt(yearAsc2);
        case "rating_desc":
          return (b.valoracion || 0) - (a.valoracion || 0);
        default:
          return 0;
      }
    });
    
  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex flex-col px-4 sm:px-8 lg:px-12 py-8">
        <Card className="w-full max-w-7xl mx-auto shadow-md">
          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px]">
            <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Necesitas iniciar sesión</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Para ver y gestionar tu colección, primero debes iniciar sesión
            </p>
            <Button 
              onClick={() => {
                // Aquí puedes mostrar el modal de inicio de sesión o redirigir
                router.push("/");
              }}
              className="cursor-pointer"
            >
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-8 lg:px-12 py-8">
      <Card className="w-full max-w-7xl mx-auto shadow-md">
        <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold">Mi Colección</h1>
              
              {!loading && !error && (
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <div className="text-center">
                    <span className="text-lg font-bold">{coleccion.length}</span>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-green-500">
                      {coleccion.filter(item => item.item?.estado === 'C').length}
                    </span>
                    <p className="text-xs text-muted-foreground">Completados</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-blue-500">
                      {coleccion.filter(item => item.item?.estado === 'E').length}
                    </span>
                    <p className="text-xs text-muted-foreground">En progreso</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tabs para filtros por tipo */}
            <Tabs 
              defaultValue="todo" 
              value={tipoFiltro} 
              onValueChange={(value) => cambiarTipoFiltro(value as TipoFiltro)}
              className="w-full mb-4"
            >
              <TabsList className="mb-4 flex flex-wrap gap-2">
                <TabsTrigger 
                  value="todo"
                  onClick={() => cambiarTipoFiltro("todo")}
                  className="rounded-full cursor-pointer"
                >
                  Todo
                </TabsTrigger>
                <TabsTrigger 
                  value="pelicula"
                  onClick={() => cambiarTipoFiltro("pelicula")}
                  className="rounded-full cursor-pointer"
                >
                  Películas
                </TabsTrigger>
                <TabsTrigger 
                  value="serie"
                  onClick={() => cambiarTipoFiltro("serie")} 
                  className="rounded-full cursor-pointer"
                >
                  Series
                </TabsTrigger>
                <TabsTrigger 
                  value="libro"
                  onClick={() => cambiarTipoFiltro("libro")}
                  className="rounded-full cursor-pointer"
                >
                  Libros
                </TabsTrigger>
                <TabsTrigger 
                  value="videojuego"
                  onClick={() => cambiarTipoFiltro("videojuego")}
                  className="rounded-full cursor-pointer"
                >
                  Juegos
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Filtros por estado */}
            <div className="flex flex-wrap justify-between items-center mb-8">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={estadoFiltro === "todo" ? "default" : "outline"}
                  className="rounded-full flex gap-2 items-center cursor-pointer"
                  onClick={() => cambiarEstadoFiltro("todo")}
                >
                  Todos
                </Button>
                <Button
                  variant={estadoFiltro === "C" ? "default" : "outline"}
                  className="rounded-full flex gap-2 items-center cursor-pointer"
                  onClick={() => cambiarEstadoFiltro("C")}
                >
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  Completados
                </Button>
                <Button
                  variant={estadoFiltro === "E" ? "default" : "outline"}
                  className="rounded-full flex gap-2 items-center cursor-pointer"
                  onClick={() => cambiarEstadoFiltro("E")}
                >
                  <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />
                  En progreso
                </Button>
                <Button
                  variant={estadoFiltro === "P" ? "default" : "outline"}
                  className="rounded-full flex gap-2 items-center cursor-pointer"
                  onClick={() => cambiarEstadoFiltro("P")}
                >
                  <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Pendientes
                </Button>
                <Button
                  variant={estadoFiltro === "A" ? "default" : "outline"}
                  className="rounded-full flex gap-2 items-center cursor-pointer"
                  onClick={() => cambiarEstadoFiltro("A")}
                >
                  <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                  Abandonados
                </Button>
              </div>
              
              {/* Ordenación */}
              {coleccion.length > 0 && (
                <div className="mt-4 sm:mt-0">
                  <ColeccionSort 
                    value={sortOption} 
                    onSortChange={(value) => cambiarSortOption(value)} 
                  />
                </div>
              )}
            </div>
            
            {/* Contenido principal */}
            {loading ? (
              <div>
                <ColeccionSkeleton />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">{error}</p>
              </div>
            ) : coleccion.length === 0 ? (
              <div className="py-4">
                <ColeccionIntro />
              </div>
            ) : contenidoFiltrado.length === 0 ? (
              <ColeccionEmpty filtroActivo={true} />
            ) : (
              <>
                {/* Mostrar indicador de cantidad cuando hay filtros activos */}
                {(tipoFiltro !== "todo" || estadoFiltro !== "todo") && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Mostrando {contenidoFiltrado.length} de {coleccion.length} elementos
                    </span>
                    {/* Botón para limpiar los filtros */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={limpiarFiltros}
                      className="h-7 text-xs cursor-pointer"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                )}
                
                {/* Mostrar estadísticas si no hay filtros aplicados */}
                {tipoFiltro === "todo" && estadoFiltro === "todo" && (
                  <ColeccionStats coleccion={coleccion} />
                )}
                
                {/* Mostrar contenido agrupado cuando no hay filtros */}
                {tipoFiltro === "todo" && estadoFiltro === "todo" ? (
                  <div>
                    {/* En progreso */}
                    <ColeccionGroup 
                      title="En progreso" 
                      contenido={coleccion.filter(item => item.item?.estado === "E")}
                      verMasUrl="?estado=E" 
                      limite={4}
                    />
                    
                    {/* Pendientes */}
                    <ColeccionGroup 
                      title="Pendientes" 
                      contenido={coleccion.filter(item => item.item?.estado === "P")}
                      verMasUrl="?estado=P"
                      limite={4}
                    />
                    
                    {/* Completados */}
                    <ColeccionGroup 
                      title="Completados" 
                      contenido={coleccion.filter(item => item.item?.estado === "C")}
                      verMasUrl="?estado=C"
                      limite={4}
                    />
                    
                    {/* Abandonados */}
                    <ColeccionGroup 
                      title="Abandonados" 
                      contenido={coleccion.filter(item => item.item?.estado === "A")}
                      verMasUrl="?estado=A"
                      limite={4}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {contenidoFiltrado.map((item) => (
                      <div key={`${item.id_api}-${item.tipo || ""}`}>
                        <ColeccionCard item={item} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
  );
}