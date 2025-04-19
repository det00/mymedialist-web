import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  CalendarDays,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  PlusCircle,
  ThumbsUp,
  Eye,
  MessageCircle,
  ArrowUpRight,
  Calendar
} from "lucide-react";

// Interfaces y tipos
interface ActivityItem {
  id: string;
  type: "watched" | "completed" | "started" | "rated" | "reviewed" | "added" | "dropped" | "resumed" | "liked" | "commented";
  date: string;
  content: {
    id: string;
    type: "movie" | "series" | "book" | "game";
    title: string;
    image?: string;
    rating?: number;
    comment?: string;
    progress?: string | number;
  };
}

interface ProfileActivityProps {
  userId: string;
}

// Datos de ejemplo para la actividad del usuario
const mockActivity: ActivityItem[] = [
  {
    id: "act1",
    type: "completed",
    date: "2025-04-18T15:30:00",
    content: {
      id: "c1",
      type: "movie",
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    }
  },
  {
    id: "act2",
    type: "rated",
    date: "2025-04-17T20:45:00",
    content: {
      id: "c2",
      type: "movie",
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      rating: 4.5
    }
  },
  {
    id: "act3",
    type: "started",
    date: "2025-04-16T18:20:00",
    content: {
      id: "c3",
      type: "series",
      title: "Stranger Things",
      image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      progress: "T1E1"
    }
  },
  {
    id: "act4",
    type: "added",
    date: "2025-04-15T10:15:00",
    content: {
      id: "c4",
      type: "book",
      title: "Fundación",
      image: "https://imagessl6.casadellibro.com/a/l/t7/36/9788498009736.jpg"
    }
  },
  {
    id: "act5",
    type: "reviewed",
    date: "2025-04-14T14:50:00",
    content: {
      id: "c5",
      type: "game",
      title: "The Legend of Zelda: Tears of the Kingdom",
      image: "https://i.blogs.es/4c8844/zelda/1366_2000.jpeg",
      comment: "Una obra maestra. La libertad que ofrece es increíble y el mundo está lleno de secretos por descubrir."
    }
  },
  {
    id: "act6",
    type: "dropped",
    date: "2025-04-13T11:30:00",
    content: {
      id: "c6",
      type: "series",
      title: "The Walking Dead",
      image: "https://m.media-amazon.com/images/I/81z-wLLNWjL._AC_UF1000,1000_QL80_.jpg",
      progress: "T7E3"
    }
  },
  {
    id: "act7",
    type: "liked",
    date: "2025-04-12T09:20:00",
    content: {
      id: "c7",
      type: "movie",
      title: "Todo en todas partes al mismo tiempo",
      image: "https://pics.filmaffinity.com/Everything_Everywhere_All_at_Once-118994283-large.jpg"
    }
  },
  {
    id: "act8",
    type: "commented",
    date: "2025-04-11T16:45:00",
    content: {
      id: "c8",
      type: "book",
      title: "Dune",
      image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      comment: "La construcción del mundo es fascinante. Una historia épica que no decepciona."
    }
  },
  {
    id: "act9",
    type: "resumed",
    date: "2025-04-10T19:15:00",
    content: {
      id: "c9",
      type: "series",
      title: "Breaking Bad",
      image: "https://flxt.tmsimg.com/assets/p8696131_b_v13_ax.jpg",
      progress: "T3E7"
    }
  },
  {
    id: "act10",
    type: "watched",
    date: "2025-04-09T21:30:00",
    content: {
      id: "c10",
      type: "movie",
      title: "El Padrino",
      image: "https://www.themoviedb.org/t/p/original/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg"
    }
  }
];

// Datos de ejemplo para las estadísticas mensuales
const mockMonthlyStats = {
  current: {
    movies: 5,
    series: 3,
    books: 2,
    games: 1,
    total: 11
  },
  previous: {
    movies: 3,
    series: 4,
    books: 1,
    games: 2,
    total: 10
  },
  change: 10 // porcentaje de cambio
};

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [activity, setActivity] = useState<ActivityItem[]>(mockActivity);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Filtrar actividad por tipo
  const filterActivityByType = (type: string) => {
    if (type === "all") {
      return mockActivity;
    }
    
    // Mapeo de tipos de contenido
    const typeMap: Record<string, string[]> = {
      "movies": ["movie"],
      "series": ["series"],
      "books": ["book"],
      "games": ["game"],
      "ratings": ["rated"],
      "reviews": ["reviewed", "commented"],
      "completed": ["completed"]
    };
    
    if (typeMap[type]) {
      if (type === "ratings" || type === "reviews" || type === "completed") {
        return mockActivity.filter(item => typeMap[type].includes(item.type));
      } else {
        return mockActivity.filter(item => typeMap[type].includes(item.content.type));
      }
    }
    
    return mockActivity;
  };
  
  // Filtrar actividad por tiempo
  const filterActivityByTime = (activities: ActivityItem[], timeRange: string) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    
    return activities.filter(item => {
      const itemDate = new Date(item.date);
      const diffTime = now.getTime() - itemDate.getTime();
      
      switch (timeRange) {
        case "today":
          return diffTime < oneDay;
        case "week":
          return diffTime < oneWeek;
        case "month":
          return diffTime < oneMonth;
        default:
          return true;
      }
    });
  };
  
  // Actualizar actividad cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    
    // Simular tiempo de carga
    setTimeout(() => {
      const filteredByType = filterActivityByType(activeTab);
      const filteredByTime = filterActivityByTime(filteredByType, timeFilter);
      setActivity(filteredByTime);
      setLoading(false);
    }, 300);
    
  }, [activeTab, timeFilter]);
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Obtener icono por tipo de contenido
  const getContentIcon = (type: string) => {
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
  
  // Obtener icono por tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "watched":
        return <Eye className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "started":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "rated":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "reviewed":
      case "commented":
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case "added":
        return <PlusCircle className="h-4 w-4 text-cyan-500" />;
      case "dropped":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "resumed":
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      case "liked":
        return <ThumbsUp className="h-4 w-4 text-pink-500" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };
  
  // Obtener texto por tipo de actividad
  const getActivityText = (item: ActivityItem) => {
    switch (item.type) {
      case "watched":
        return `has visto`;
      case "completed":
        return `has completado`;
      case "started":
        return `has empezado`;
      case "rated":
        return `has valorado`;
      case "reviewed":
        return `has reseñado`;
      case "added":
        return `has añadido a tu lista`;
      case "dropped":
        return `has abandonado`;
      case "resumed":
        return `has retomado`;
      case "liked":
        return `te ha gustado`;
      case "commented":
        return `has comentado sobre`;
      default:
        return `has actualizado`;
    }
  };
  
  // Obtener nombre completo del tipo de contenido
  const getContentTypeName = (type: string) => {
    switch (type) {
      case "movie":
        return "la película";
      case "series":
        return "la serie";
      case "book":
        return "el libro";
      case "game":
        return "el juego";
      default:
        return "el contenido";
    }
  };
  
  // Renderizar actividad
  const renderActivity = () => {
    if (loading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando actividad...</p>
        </div>
      );
    }
    
    if (activity.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No se encontró actividad para los filtros seleccionados.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {activity.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden hover:border-primary transition-colors">
            <div className="flex p-4">
              {/* Imagen */}
              <div className="relative h-24 w-16 flex-shrink-0 mr-4">
                {item.content.image ? (
                  <Image
                    src={item.content.image}
                    alt={item.content.title}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="bg-muted h-full w-full rounded-md flex items-center justify-center">
                    {getContentIcon(item.content.type)}
                  </div>
                )}
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getContentIcon(item.content.type)}
                        {getContentTypeName(item.content.type)}
                      </Badge>
                      <Badge className="ml-2 flex items-center gap-1">
                        {getActivityIcon(item.type)}
                        {item.type === "rated" ? `${item.content.rating}/5` : ""}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium">{item.content.title}</h3>
                    <p className="text-sm mt-1">
                      Tú {getActivityText(item)} {getContentTypeName(item.content.type).toLowerCase()} {item.content.progress ? `(${item.content.progress})` : ""}
                    </p>
                    
                    {(item.type === "reviewed" || item.type === "commented") && item.content.comment && (
                      <div className="mt-2 text-sm p-2 bg-muted rounded-md">
                        &quot;{item.content.comment}&quot;
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {formatRelativeTime(item.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Estadísticas de este mes */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Resumen de actividad</CardTitle>
            <CardDescription>
              Este mes vs mes anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <Film className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{mockMonthlyStats.current.movies}</div>
                <div className="text-xs text-muted-foreground">Películas</div>
                <div className={`text-xs mt-1 ${mockMonthlyStats.current.movies > mockMonthlyStats.previous.movies ? 'text-green-500' : 'text-red-500'}`}>
                  {mockMonthlyStats.current.movies > mockMonthlyStats.previous.movies ? '↑' : '↓'} 
                  {Math.abs(mockMonthlyStats.current.movies - mockMonthlyStats.previous.movies)}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <Tv className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{mockMonthlyStats.current.series}</div>
                <div className="text-xs text-muted-foreground">Series</div>
                <div className={`text-xs mt-1 ${mockMonthlyStats.current.series > mockMonthlyStats.previous.series ? 'text-green-500' : 'text-red-500'}`}>
                  {mockMonthlyStats.current.series > mockMonthlyStats.previous.series ? '↑' : '↓'} 
                  {Math.abs(mockMonthlyStats.current.series - mockMonthlyStats.previous.series)}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{mockMonthlyStats.current.books}</div>
                <div className="text-xs text-muted-foreground">Libros</div>
                <div className={`text-xs mt-1 ${mockMonthlyStats.current.books > mockMonthlyStats.previous.books ? 'text-green-500' : 'text-red-500'}`}>
                  {mockMonthlyStats.current.books > mockMonthlyStats.previous.books ? '↑' : '↓'} 
                  {Math.abs(mockMonthlyStats.current.books - mockMonthlyStats.previous.books)}
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <Gamepad2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{mockMonthlyStats.current.games}</div>
                <div className="text-xs text-muted-foreground">Juegos</div>
                <div className={`text-xs mt-1 ${mockMonthlyStats.current.games > mockMonthlyStats.previous.games ? 'text-green-500' : 'text-red-500'}`}>
                  {mockMonthlyStats.current.games > mockMonthlyStats.previous.games ? '↑' : '↓'} 
                  {Math.abs(mockMonthlyStats.current.games - mockMonthlyStats.previous.games)}
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{mockMonthlyStats.current.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className={`text-xs mt-1 ${mockMonthlyStats.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {mockMonthlyStats.change > 0 ? '↑' : '↓'} {Math.abs(mockMonthlyStats.change)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Filtro de tiempo */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Filtrar por</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      {/* Actividad */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>
            Lo que has estado viendo, leyendo y jugando
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 mb-6">
              <TabsTrigger value="all">Todo</TabsTrigger>
              <TabsTrigger value="movies">Películas</TabsTrigger>
              <TabsTrigger value="series">Series</TabsTrigger>
              <TabsTrigger value="books">Libros</TabsTrigger>
              <TabsTrigger value="games">Juegos</TabsTrigger>
              <TabsTrigger value="ratings">Valoraciones</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            
            {/* Contenido de actividad */}
            {renderActivity()}
          </Tabs>
        </CardContent>
        <CardFooter className="pt-6">
          <Button variant="outline" className="w-full">
            Ver toda la actividad
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}