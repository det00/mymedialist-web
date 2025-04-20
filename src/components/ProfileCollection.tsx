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
  CircleSlash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interfaces y tipos
interface CollectionItem {
  id: string;
  apiId: string;
  title: string;
  type: "movie" | "series" | "book" | "game";
  image?: string;
  creator?: string;
  year?: string;
  genres?: string[];
  status: "completed" | "in-progress" | "planned" | "dropped";
  rating?: number;
  progress?: string | number;
  dateAdded: string;
  dateUpdated: string;
}

interface ProfileCollectionProps {
  userId: string;
}

// Datos de ejemplo para la colección
const mockCollection: CollectionItem[] = [
  {
    id: "c1",
    apiId: "tt0816692",
    title: "Interstellar",
    type: "movie",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    creator: "Christopher Nolan",
    year: "2014",
    genres: ["Ciencia ficción", "Drama", "Aventura"],
    status: "completed",
    rating: 4.5,
    dateAdded: "2025-01-15T10:30:00",
    dateUpdated: "2025-01-20T18:45:00"
  },
  // ... (resto de los elementos de la colección mock)
];

export function ProfileCollection({ userId }: ProfileCollectionProps) {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [activeType, setActiveType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [collection, setCollection] = useState<CollectionItem[]>(mockCollection);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Filtrar colección basado en status, tipo y búsqueda
  useEffect(() => {
    setLoading(true);
    
    // Simular tiempo de carga
    setTimeout(() => {
      let filtered = [...mockCollection];
      
      // Filtrar por estado
      if (activeStatus !== "all") {
        filtered = filtered.filter(item => item.status === activeStatus);
      }
      
      // Filtrar por tipo
      if (activeType !== "all") {
        filtered = filtered.filter(item => item.type === activeType);
      }
      
      // Filtrar por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          item => 
            item.title.toLowerCase().includes(query) || 
            (item.creator && item.creator.toLowerCase().includes(query))
        );
      }
      
      // Ordenar
      filtered = sortCollection(filtered, sortBy);
      
      setCollection(filtered);
      setLoading(false);
    }, 300);
    
  }, [activeStatus, activeType, searchQuery, sortBy]);
  
  // Ordenar colección
  const sortCollection = (items: CollectionItem[], sort: string) => {
    switch (sort) {
      case "title-asc":
        return [...items].sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return [...items].sort((a, b) => b.title.localeCompare(a.title));
      case "date-asc":
        return [...items].sort((a, b) => 
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      case "date-desc":
        return [...items].sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "rating-desc":
        return [...items].sort((a, b) => 
          (b.rating || 0) - (a.rating || 0)
        );
      default:
        return items;
    }
  };
  
  // Obtener icono para tipo de contenido
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-4 w-4" />;
      case "series":
        return <Tv className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "game":
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };
  
  // Obtener icono para estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "planned":
        return <ListTodo className="h-4 w-4 text-yellow-500" />;
      case "dropped":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <CircleSlash className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Obtener color para estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "in-progress":
        return "text-blue-500";
      case "planned":
        return "text-yellow-500";
      case "dropped":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  // Obtener nombre para estado
  const getStatusName = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "in-progress":
        return "En progreso";
      case "planned":
        return "Pendiente";
      case "dropped":
        return "Abandonado";
      default:
        return "Desconocido";
    }
  };
  
  // Obtener nombre para tipo
  const getTypeName = (type: string) => {
    switch (type) {
      case "movie":
        return "Película";
      case "series":
        return "Serie";
      case "book":
        return "Libro";
      case "game":
        return "Juego";
      default:
        return "Desconocido";
    }
  };
  
  // Estadísticas de colección
  const collectionStats = {
    all: mockCollection.length,
    completed: mockCollection.filter(item => item.status === "completed").length,
    inProgress: mockCollection.filter(item => item.status === "in-progress").length,
    planned: mockCollection.filter(item => item.status === "planned").length,
    dropped: mockCollection.filter(item => item.status === "dropped").length,
    movies: mockCollection.filter(item => item.type === "movie").length,
    series: mockCollection.filter(item => item.type === "series").length,
    books: mockCollection.filter(item => item.type === "book").length,
    games: mockCollection.filter(item => item.type === "game").length
  };
  
  // Renderizar colección
  const renderCollection = () => {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando colección...</p>
        </div>
      );
    }
    
    if (collection.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No se encontraron elementos en tu colección con los filtros actuales.</p>
          <Button>Añadir contenido</Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {collection.map((item) => (
          <Link key={item.id} href={`/${item.type === "movie" ? "pelicula" : item.type === "series" ? "serie" : item.type === "book" ? "libro" : "videojuego"}/${item.apiId}`}>
            <div className="border rounded-lg overflow-hidden flex flex-col hover:border-primary transition-colors cursor-pointer h-full">
              {/* Imagen */}
              <div className="relative h-40 w-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-muted h-full w-full flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                )}
                
                {/* Badges en la imagen */}
                <div className="absolute top-2 left-2">
                  <Badge className="flex items-center gap-1">
                    {getTypeIcon(item.type)}
                    {getTypeName(item.type)}
                  </Badge>
                </div>
                
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className={`flex items-center gap-1 bg-background/80 backdrop-blur-sm ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.progress ? item.progress : ""}
                  </Badge>
                </div>
                
                {/* Valoración */}
                {item.rating && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-yellow-500">
                      {item.rating}/5
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Información */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium line-clamp-2 mb-1">{item.title}</h3>
                <div className="text-sm text-muted-foreground">
                  {item.creator && <div className="line-clamp-1">{item.creator}</div>}
                  
                  {item.year && (
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.year}
                    </div>
                  )}
                </div>
                
                {/* Géneros */}
                {item.genres && item.genres.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.genres.slice(0, 2).map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {item.genres.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.genres.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Estado */}
                <div className={`mt-auto pt-4 text-sm ${getStatusColor(item.status)}`}>
                  {getStatusName(item.status)}
                </div>
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
            {collectionStats.all} elementos en total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
              <div className="text-2xl font-bold">{collectionStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completados</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <Clock className="h-6 w-6 mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{collectionStats.inProgress}</div>
              <div className="text-xs text-muted-foreground">En progreso</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <ListTodo className="h-6 w-6 mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{collectionStats.planned}</div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg flex flex-col items-center">
              <Ban className="h-6 w-6 mb-2 text-red-500" />
              <div className="text-2xl font-bold">{collectionStats.dropped}</div>
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
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tipo de contenido</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveType("all")}
              >
                <span className="w-4 h-4 mr-2">{activeType === "all" && "✓"}</span>
                Todo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveType("movie")}
              >
                <Film className="h-4 w-4 mr-2" />
                <span className="w-4 h-4 mr-2">{activeType === "movie" && "✓"}</span>
                Películas
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveType("series")}
              >
                <Tv className="h-4 w-4 mr-2" />
                <span className="w-4 h-4 mr-2">{activeType === "series" && "✓"}</span>
                Series
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveType("book")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="w-4 h-4 mr-2">{activeType === "book" && "✓"}</span>
                Libros
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveType("game")}
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                <span className="w-4 h-4 mr-2">{activeType === "game" && "✓"}</span>
                Juegos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("date-desc")}
              >
                <span className="w-4 h-4 mr-2">{sortBy === "date-desc" && "✓"}</span>
                Fecha (reciente primero)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("date-asc")}
              >
                <span className="w-4 h-4 mr-2">{sortBy === "date-asc" && "✓"}</span>
                Fecha (antiguo primero)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("title-asc")}
              >
                <span className="w-4 h-4 mr-2">{sortBy === "title-asc" && "✓"}</span>
                Título (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("title-desc")}
              >
                <span className="w-4 h-4 mr-2">{sortBy === "title-desc" && "✓"}</span>
                Título (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setSortBy("rating-desc")}
              >
                <span className="w-4 h-4 mr-2">{sortBy === "rating-desc" && "✓"}</span>
                Valoración
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>
      
      {/* Tabs de estado */}
      <Tabs value={activeStatus} onValueChange={setActiveStatus}>
        <TabsList className="grid grid-cols-3 sm:grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-1">
            Todo
            <Badge variant="secondary" className="ml-1">
              {collectionStats.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline">Completados</span>
            <Badge variant="secondary" className="ml-1">
              {collectionStats.completed}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="hidden sm:inline">En progreso</span>
            <Badge variant="secondary" className="ml-1">
              {collectionStats.inProgress}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="planned" className="flex items-center gap-1">
            <ListTodo className="h-4 w-4 text-yellow-500" />
            <span className="hidden sm:inline">Pendientes</span>
            <Badge variant="secondary" className="ml-1">
              {collectionStats.planned}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="dropped" className="flex items-center gap-1">
            <Ban className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">Abandonados</span>
            <Badge variant="secondary" className="ml-1">
              {collectionStats.dropped}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido */}
        <TabsContent value="all" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="in-progress" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="planned" className="mt-6">
          {renderCollection()}
        </TabsContent>
        <TabsContent value="dropped" className="mt-6">
          {renderCollection()}
        </TabsContent>
      </Tabs>
    </div>
  );
}