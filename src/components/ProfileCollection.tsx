import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  ArrowUpDown,
  Film, 
  Tv, 
  BookOpen, 
  Gamepad2,
  CheckCircle,
  Clock,
  ListTodo,
  Ban,
  Calendar,
  CircleSlash,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { collectionService } from "@/lib/collection";
import { Contenido } from "@/lib/types";

interface ProfileCollectionProps {
  userId: string;
}

export function ProfileCollection({ userId }: ProfileCollectionProps) {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState<string>("todo");
  const [activeType, setActiveType] = useState<string>("todo");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title_asc");
  const [collection, setCollection] = useState<Contenido[]>([]);
  const [filteredCollection, setFilteredCollection] = useState<Contenido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: { C: 0, E: 0, P: 0, A: 0 },
    byType: { P: 0, S: 0, L: 0, V: 0 }
  });
  
  // Cargar colección inicial
  useEffect(() => {
    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Cargar la colección completa
        const result = await collectionService.getUserCollection();
        setCollection(result);
        
        // Cargar estadísticas
        const statsResult = await collectionService.getCollectionStats();
        setStats(statsResult);
        
        // Aplicar filtros iniciales
        filterCollection(result, activeType, activeStatus, searchQuery, sortBy);
      } catch (err) {
        console.error("Error al cargar la colección:", err);
        setError("No se pudo cargar tu colección. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    loadCollection();
  }, [userId]);
  
  // Filtrar colección cuando cambian los filtros
  useEffect(() => {
    filterCollection(collection, activeType, activeStatus, searchQuery, sortBy);
  }, [activeType, activeStatus, searchQuery, sortBy]);
  
  // Función para filtrar la colección
  const filterCollection = (
    items: Contenido[], 
    tipo: string, 
    estado: string, 
    query: string,
    sort: string
  ) => {
    let filtered = [...items];
    
    // Filtrar por tipo
    if (tipo !== "todo") {
      // Convertir tipo a formato adecuado
      filtered = filtered.filter(item => {
        const itemTipo = item.tipo?.toLowerCase();
        return itemTipo === tipo.toLowerCase();
      });
    }
    
    // Filtrar por estado
    if (estado !== "todo") {
      filtered = filtered.filter(item => item.item?.estado === estado);
    }
    
    // Filtrar por búsqueda
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.titulo.toLowerCase().includes(lowercaseQuery) || 
        (item.autor && item.autor.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Ordenar según el criterio seleccionado
    switch (sort) {
      case "title_asc":
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "date_desc":
        filtered.sort((a, b) => {
          const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearB) - parseInt(yearA);
        });
        break;
      case "date_asc":
        filtered.sort((a, b) => {
          const yearA = a.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          const yearB = b.fechaLanzamiento?.match(/(\d{4})/)?.[1] || "0";
          return parseInt(yearA) - parseInt(yearB);
        });
        break;
      case "rating_desc":
        filtered.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
        break;
    }
    
    setFilteredCollection(filtered);
  };
  
  // Recargar datos
  const reloadCollection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar la colección completa
      const result = await collectionService.getUserCollection();
      setCollection(result);
      
      // Cargar estadísticas
      const statsResult = await collectionService.getCollectionStats();
      setStats(statsResult);
      
      // Aplicar filtros actuales
      filterCollection(result, activeType, activeStatus, searchQuery, sortBy);
    } catch (err) {
      console.error("Error al recargar la colección:", err);
      setError("No se pudo recargar tu colección. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };
  
  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setActiveType("todo");
    setActiveStatus("todo");
    setSearchQuery("");
    setSortBy("title_asc");
  };
  
  // Obtener icono para tipo de contenido
  const getTypeIcon = (type: string) => {
    const tipoMayuscula = type.toUpperCase().charAt(0);
    switch (tipoMayuscula) {
      case "P":
        return <Film className="h-4 w-4" />;
      case "S":
        return <Tv className="h-4 w-4" />;
      case "L":
        return <BookOpen className="h-4 w-4" />;
      case "V":
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };
  
  // Obtener icono para estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "C":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "E":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "P":
        return <ListTodo className="h-4 w-4 text-yellow-500" />;
      case "A":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <CircleSlash className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Obtener color para estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "C":
        return "text-green-500";
      case "E":
        return "text-blue-500";
      case "P":
        return "text-yellow-500";
      case "A":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  // Obtener nombre para estado
  const getStatusName = (status: string) => {
    switch (status) {
      case "C":
        return "Completado";
      case "E":
        return "En progreso";
      case "P":
        return "Pendiente";
      case "A":
        return "Abandonado";
      default:
        return "Desconocido";
    }
  };
  
  // Obtener nombre para tipo
  const getTypeName = (type: string) => {
    const tipoMayuscula = type.toUpperCase().charAt(0);
    switch (tipoMayuscula) {
      case "P":
        return "Película";
      case "S":
        return "Serie";
      case "L":
        return "Libro";
      case "V":
        return "Videojuego";
      default:
        return type;
    }
  };
  
  // Obtener la ruta para el elemento según su tipo
  const getItemRoute = (item: Contenido) => {
    const tipoMayuscula = item.tipo?.toUpperCase().charAt(0);
    let route = "";
    
    switch (tipoMayuscula) {
      case "P":
        route = "pelicula";
        break;
      case "S":
        route = "serie";
        break;
      case "L":
        route = "libro";
        break;
      case "V":
        route = "videojuego";
        break;
      default:
        route = "contenido";
    }
    
    return `/${route}/${item.id_api}`;
  };
  
  // Renderizar colección
  const renderCollection = () => {
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
          <Button onClick={reloadCollection} className="cursor-pointer">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
        </div>
      );
    }
    
    if (collection.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Aún no has añadido contenido a tu colección.</p>
          <Link href="/busqueda?busqueda=&tipo=P">
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Añadir contenido
            </Button>
          </Link>
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
        {filteredCollection.map((item) => (
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
                    className="object-cover"
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
                  {item.item?.estado && (
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 bg-background/80 backdrop-blur-sm ${getStatusColor(item.item.estado)}`}
                    >
                      {getStatusIcon(item.item.estado)}
                    </Badge>
                  )}
                </div>
                
                {/* Valoración */}
                {item.valoracion && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-yellow-500">
                      {item.valoracion}/10
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Información */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium line-clamp-2 mb-1">{item.titulo}</h3>
                <div className="text-sm text-muted-foreground">
                  {item.autor && <div className="line-clamp-1">{item.autor}</div>}
                  
                  {item.fechaLanzamiento && (
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {/* Extraer solo el año */}
                      {item.fechaLanzamiento.match(/(\d{4})/)?.[1] || item.fechaLanzamiento}
                    </div>
                  )}
                </div>
                
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
                {item.item?.estado && (
                  <div className={`mt-auto pt-4 text-sm ${getStatusColor(item.item.estado)}`}>
                    {getStatusName(item.item.estado)}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };
  
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
        
        {/* Filtros y ordenación */}
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none cursor-pointer"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("title_asc")}
              >
                <div className="w-4 h-4 mr-2">{sortBy === "title_asc" && "✓"}</div>
                Título (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("title_desc")}
              >
                <div className="w-4 h-4 mr-2">{sortBy === "title_desc" && "✓"}</div>
                Título (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("date_desc")}
              >
                <div className="w-4 h-4 mr-2">{sortBy === "date_desc" && "✓"}</div>
                Más recientes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("date_asc")}
              >
                <div className="w-4 h-4 mr-2">{sortBy === "date_asc" && "✓"}</div>
                Más antiguos
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("rating_desc")}
              >
                <div className="w-4 h-4 mr-2">{sortBy === "rating_desc" && "✓"}</div>
                Valoración
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/busqueda?busqueda=&tipo=P">
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tabs de estado */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
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
        
        {/* Contenido */}
        <TabsContent value="todo" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="C" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="E" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="P" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="A" className="mt-6">
          {renderCollection()}
        </TabsContent>
      </Tabs>
    </div>
  );
}