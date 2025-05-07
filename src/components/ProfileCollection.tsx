"use client";

import { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  Film, 
  Tv, 
  BookOpen, 
  Gamepad2,
  CheckCircle,
  Clock,
  ListTodo,
  Ban,
  CircleSlash,
  AlertCircle,
  RefreshCw,
  ListFilter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardBasic, SortOption } from "@/lib/types";
import { useCollection } from "@/hooks/useCollection";

// Mapeo de tipos de iconos (calculados una sola vez)
const typeIcons = {
  "P": <Film className="h-4 w-4" />,
  "S": <Tv className="h-4 w-4" />,
  "L": <BookOpen className="h-4 w-4" />,
  "V": <Gamepad2 className="h-4 w-4" />,
  "default": <Film className="h-4 w-4" />
};

// Mapeo de estados a iconos (calculados una sola vez)
const statusIcons = {
  "C": <CheckCircle className="h-4 w-4 text-green-500" />,
  "E": <Clock className="h-4 w-4 text-blue-500" />,
  "P": <ListTodo className="h-4 w-4 text-yellow-500" />,
  "A": <Ban className="h-4 w-4 text-red-500" />,
  "default": <CircleSlash className="h-4 w-4 text-muted-foreground" />
};

// Mapeo de estados a colores (calculados una sola vez)
const statusColors = {
  "C": "text-green-500",
  "E": "text-blue-500",
  "P": "text-yellow-500",
  "A": "text-red-500",
  "default": "text-muted-foreground"
};

// Mapeo de estados a nombres (calculados una sola vez)
const statusNames = {
  "C": "Completado",
  "E": "En progreso",
  "P": "Pendiente",
  "A": "Abandonado",
  "default": "Desconocido"
};

// Mapeo de tipos a nombres (calculados una sola vez)
const typeNames = {
  "P": "Película",
  "S": "Serie",
  "L": "Libro",
  "V": "Videojuego",
  "default": "Contenido"
};

// Mapeo de tipos a rutas (calculados una sola vez)
const typeRoutes = {
  "P": "pelicula",
  "S": "serie",
  "L": "libro",
  "V": "videojuego",
  "default": "contenido"
};

interface ProfileCollectionProps {
  userId: string;
}

export function ProfileCollection({ userId }: ProfileCollectionProps) {
  // Usar el hook useCollection
  const {
    filteredCollection,
    loading,
    error,
    filters,
    sortOption,
    stats,
    loadCollection,
    updateFilters,
    updateSort,
    clearFilters
  } = useCollection({
    userId: parseInt(userId)
  });
  
  // Estados locales solo para búsqueda local
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Obtener icono para tipo de contenido
  const getTypeIcon = useCallback((type: string) => {
    const key = type.toUpperCase().charAt(0) as keyof typeof typeIcons;
    return typeIcons[key] || typeIcons.default;
  }, []);
  
  // Obtener icono para estado
  const getStatusIcon = useCallback((status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || statusIcons.default;
  }, []);
  
  // Obtener color para estado
  const getStatusColor = useCallback((status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.default;
  }, []);
  
  // Obtener nombre para estado
  const getStatusName = useCallback((status: string) => {
    return statusNames[status as keyof typeof statusNames] || statusNames.default;
  }, []);
  
  // Obtener nombre para tipo
  const getTypeName = useCallback((type: string) => {
    const key = type.toUpperCase().charAt(0) as keyof typeof typeNames;
    return typeNames[key] || typeNames.default;
  }, []);
  
  // Obtener la ruta para el elemento según su tipo
  const getItemRoute = useCallback((item: CardBasic) => {
    const key = item.tipo?.toUpperCase().charAt(0) as keyof typeof typeRoutes;
    const route = typeRoutes[key] || typeRoutes.default;
    return `/${route}/${item.id_api}`;
  }, []);
  
  // Filtrar por búsqueda local después de los filtros del hook
  const localFilteredCollection = useMemo(() => {
    let filtered = [...filteredCollection];
    
    // Filtrar por búsqueda
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(lowercaseQuery) || 
        (item.autor && item.autor.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    return filtered;
  }, [filteredCollection, searchQuery]);
  
  // Renderizar un elemento individual (memoizado para evitar rerenderizados)
  const renderItem = useCallback((item: CardBasic) => {
    return (
      <Link 
        href={getItemRoute(item)} 
        key={`${item.id_api}-${item.tipo}`}
        className="cursor-pointer"
      >
        <div className="border rounded-lg overflow-hidden flex flex-col hover:border-primary transition-colors h-full">
          {/* Imagen */}
          <div className="relative h-40 w-full">
            {item.imagen ? (
              <Image
                src={item.imagen}
                alt={item.titulo}
                fill
                sizes={item.imagen}
                className="object-cover"
                loading="lazy" // Lazy loading para mejora de rendimiento
              />
            ) : (
              <div className="bg-muted h-full w-full flex items-center justify-center">
                {getTypeIcon(item.tipo || "")}
              </div>
            )}
            
            {/* Badges en la imagen */}
            <div className="absolute top-2 left-2">
              <Badge className="flex items-center gap-1">
                {getTypeIcon(item.tipo || "")}
                {getTypeName(item.tipo || "")}
              </Badge>
            </div>
            
            <div className="absolute top-2 right-2">
              {item.estado && (
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 bg-background/80 backdrop-blur-sm ${getStatusColor(item.estado)}`}
                >
                  {getStatusIcon(item.estado)}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Información */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-medium line-clamp-2 mb-1">{item.titulo}</h3>
            {item.autor && (
              <div className="text-sm text-muted-foreground line-clamp-1">
                {item.autor}
              </div>
            )}
            
            {/* Géneros */}
            {item.genero && item.genero.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {item.genero.slice(0, 2).map((genre, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {item.genero.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.genero.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Estado */}
            {item.estado && (
              <div className={`mt-auto pt-4 text-sm ${getStatusColor(item.estado)}`}>
                {getStatusName(item.estado)}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }, [getTypeIcon, getTypeName, getStatusIcon, getStatusColor, getStatusName, getItemRoute]);
  
  // Renderizar la lista de elementos (ahora mucho más eficiente)
  const renderCollection = useMemo(() => {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu colección...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => loadCollection(parseInt(userId))} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
        </div>
      );
    }
    
    if (filteredCollection.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No se encontraron elementos con los filtros actuales.</p>
          <Button onClick={clearFilters} className="cursor-pointer">
            Limpiar filtros
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {localFilteredCollection.map(item => renderItem(item))}
      </div>
    );
  }, [loading, error, localFilteredCollection, userId, clearFilters, renderItem]);
  
  const handleStateFilterChange = (estado: string) => {
    updateFilters({ 
      estado: estado === "todo" ? undefined : estado,
      tipo: filters.tipo
    });
  };
  
  const handleClearFilters = () => {
    clearFilters();
    setSearchQuery("");
  };

  // Renderizar la interfaz completa
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mi colección</CardTitle>
          <CardDescription>
            {stats.total} elementos en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.byStatus.C}</div>
              <div className="text-xs text-muted-foreground">Completados</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <Clock className="h-6 w-6 mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.byStatus.E}</div>
              <div className="text-xs text-muted-foreground">En progreso</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <ListTodo className="h-6 w-6 mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.byStatus.P}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <Ban className="h-6 w-6 mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.byStatus.A}</div>
              <div className="text-xs text-muted-foreground">Abandonados</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en mi colección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Filtro por tipo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none cursor-pointer"
              >
                {filters.tipo === "pelicula" ? <Film className="h-4 w-4 mr-2" /> :
                 filters.tipo === "serie" ? <Tv className="h-4 w-4 mr-2" /> :
                 filters.tipo === "libro" ? <BookOpen className="h-4 w-4 mr-2" /> :
                 filters.tipo === "videojuego" ? <Gamepad2 className="h-4 w-4 mr-2" /> :
                 <ListFilter className="h-4 w-4 mr-2" />}
                {filters.tipo 
                  ? typeNames[filters.tipo.charAt(0).toUpperCase() as keyof typeof typeNames] 
                  : "Tipo"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Tipo de contenido</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateFilters({ tipo: undefined, estado: filters.estado })}
              >
                <div className="flex items-center gap-2 w-full">
                  <ListFilter className="h-4 w-4" />
                  Todo
                  {!filters.tipo && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateFilters({ tipo: "pelicula", estado: filters.estado })}
              >
                <div className="flex items-center gap-2 w-full">
                  <Film className="h-4 w-4" />
                  Películas
                  {filters.tipo === "pelicula" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateFilters({ tipo: "serie", estado: filters.estado })}
              >
                <div className="flex items-center gap-2 w-full">
                  <Tv className="h-4 w-4" />
                  Series
                  {filters.tipo === "serie" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateFilters({ tipo: "libro", estado: filters.estado })}
              >
                <div className="flex items-center gap-2 w-full">
                  <BookOpen className="h-4 w-4" />
                  Libros
                  {filters.tipo === "libro" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateFilters({ tipo: "videojuego", estado: filters.estado })}
              >
                <div className="flex items-center gap-2 w-full">
                  <Gamepad2 className="h-4 w-4" />
                  Videojuegos
                  {filters.tipo === "videojuego" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Ordenación */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none cursor-pointer"
              >
                <Filter className="h-4 w-4 mr-2" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateSort("title_asc" as SortOption)}
              >
                <div className="flex items-center justify-between w-full">
                  Título (A-Z)
                  {sortOption === "title_asc" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => updateSort("title_desc" as SortOption)}
              >
                <div className="flex items-center justify-between w-full">
                  Título (Z-A)
                  {sortOption === "title_desc" && <span className="ml-auto">✓</span>}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Botón Limpiar Filtros */}
          {/* {(filters.tipo || filters.estado || searchQuery) && (
            <Button 
              variant="ghost" 
              className="cursor-pointer"
              onClick={handleClearFilters}
            >
              Limpiar
            </Button>
          )} */}
          
          {/* <Link href="/busqueda?busqueda=&tipo=P">
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </Link> */}
        </div>
      </div>
      
      {/* Tabs de estado */}
      <Tabs value={filters.estado || "todo"} onValueChange={handleStateFilterChange}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-5">
          <TabsTrigger value="todo" className="flex items-center gap-1 cursor-pointer">
            Todo
            <Badge variant="secondary" className="ml-1">
              {stats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="C" className="flex items-center gap-1 cursor-pointer">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline">Completados</span>
            <Badge variant="secondary" className="ml-1">
              {stats.byStatus.C}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="E" className="flex items-center gap-1 cursor-pointer">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline">En progreso</span>
            <Badge variant="secondary" className="ml-1">
              {stats.byStatus.E}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="P" className="flex items-center gap-1 cursor-pointer">
            <ListTodo className="h-4 w-4 text-yellow-500" />
            <span className="hidden sm:inline">Pendientes</span>
            <Badge variant="secondary" className="ml-1">
              {stats.byStatus.P}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="A" className="flex items-center gap-1 cursor-pointer">
            <Ban className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">Abandonados</span>
            <Badge variant="secondary" className="ml-1">
              {stats.byStatus.A}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todo" className="mt-6">
          {renderCollection}
        </TabsContent>
        <TabsContent value="C" className="mt-6">
          {renderCollection}
        </TabsContent>
        <TabsContent value="E" className="mt-6">
          {renderCollection}
        </TabsContent>
        <TabsContent value="P" className="mt-6">
          {renderCollection}
        </TabsContent>
        <TabsContent value="A" className="mt-6">
          {renderCollection}
        </TabsContent>
      </Tabs>
    </div>
  );
}
