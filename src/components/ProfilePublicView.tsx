import { useState } from "react";
import Image from "next/image";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
import { 
  Calendar, 
  Users, 
  Film, 
  Tv, 
  BookOpen, 
  Gamepad2,
  UserPlus,
  UserCheck,
  Share2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Interfaz para los datos del perfil
interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string;
  joinDate: string;
  email: string;
  avatar: string;
  stats: {
    totalContent: number;
    completed: number;
    inProgress: number;
    planned: number;
    dropped: number;
    movies: number;
    series: number;
    books: number;
    games: number;
  };
  isCurrentUser: boolean;
}

// Datos simulados de actividad reciente
const mockActivities = [
  {
    id: "1",
    type: "completed",
    content: {
      id: "101",
      type: "movie",
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
    date: "2025-04-15T14:30:00"
  },
  {
    id: "2",
    type: "started",
    content: {
      id: "102",
      type: "series",
      title: "Stranger Things",
      image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg"
    },
    date: "2025-04-10T18:45:00"
  },
  {
    id: "3",
    type: "added",
    content: {
      id: "103",
      type: "book",
      title: "Dune",
      image: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg"
    },
    date: "2025-04-05T09:15:00"
  }
];

// Datos simulados de colección
const mockCollection = {
  inProgress: [
    {
      id: "201",
      type: "series",
      title: "Breaking Bad",
      image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      progress: "T3E8"
    },
    {
      id: "202",
      type: "book",
      title: "El nombre del viento",
      image: "https://m.media-amazon.com/images/I/91DZsbCHcbL._AC_UF1000,1000_QL80_.jpg",
      progress: "45%"
    }
  ],
  completed: [
    {
      id: "203",
      type: "movie",
      title: "Interstellar",
      image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
      id: "204",
      type: "movie",
      title: "Inception",
      image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
      id: "205",
      type: "game",
      title: "The Last of Us Part II",
      image: "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/Y02L3BPV8NtWrYV1y4AkJcC3.jpg"
    }
  ],
  planned: [
    {
      id: "206",
      type: "series",
      title: "The Mandalorian",
      image: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg"
    },
    {
      id: "207",
      type: "book",
      title: "Fundación",
      image: "https://imagessl6.casadellibro.com/a/l/t7/36/9788498009736.jpg"
    }
  ]
};

// Datos simulados de amigos
const mockFriends = [
  {
    id: "301",
    name: "Ana Gómez",
    username: "anagomez",
    avatar: "initial_#E84393_AG",
    mutualFriends: 5
  },
  {
    id: "302",
    name: "Miguel Rivas",
    username: "mrivas",
    avatar: "avatar3",
    mutualFriends: 3
  },
  {
    id: "303",
    name: "Laura Sánchez",
    username: "laurasanchez",
    avatar: "initial_#0984E3_LS",
    mutualFriends: 2
  },
  {
    id: "304",
    name: "Pablo Martín",
    username: "pablomartin",
    avatar: "avatar4",
    mutualFriends: 1
  }
];

interface ProfilePublicViewProps {
  profileData: ProfileData;
}

export function ProfilePublicView({ profileData }: ProfilePublicViewProps) {
  const [activeTab, setActiveTab] = useState("activity");
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Manejar seguir/dejar de seguir
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };
  
  // Manejar compartir perfil
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profileData.name} en MyMediaList`,
        text: `Échale un vistazo al perfil de ${profileData.name} en MyMediaList`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error al compartir:', err);
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      alert(`Comparte este enlace: ${window.location.href}`);
    }
  };
  
  // Función auxiliar para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Función auxiliar para renderizar tipo de actividad
  const renderActivityType = (type: string) => {
    switch (type) {
      case "completed":
        return "ha completado";
      case "started":
        return "ha empezado";
      case "added":
        return "ha añadido";
      case "dropped":
        return "ha abandonado";
      default:
        return "ha actualizado";
    }
  };
  
  // Función auxiliar para renderizar ícono de tipo de contenido
  const renderContentTypeIcon = (type: string) => {
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
  
  // Función auxiliar para obtener nombre completo del tipo
  const getContentTypeName = (type: string) => {
    switch (type) {
      case "movie":
        return "Película";
      case "series":
        return "Serie";
      case "book":
        return "Libro";
      case "game":
        return "Videojuego";
      default:
        return "Contenido";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna izquierda - Información del perfil */}
      <div className="lg:col-span-3 space-y-6">
        {/* Tarjeta principal del perfil */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <UserAvatar 
                avatarData={profileData.avatar} 
                size="xl" 
                className="mb-4"
              />
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground text-sm">@{profileData.username}</p>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Miembro desde {new Date(profileData.joinDate).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long'
                })}
              </div>
              
              <div className="flex gap-3 mt-4">
                <div className="text-center">
                  <p className="font-bold">{profileData.stats.totalContent}</p>
                  <p className="text-xs text-muted-foreground">Contenido</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Amigos</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-2 pt-0 pb-6">
            <Button 
              variant={isFollowing ? "outline" : "default"} 
              size="sm" 
              onClick={handleFollowToggle}
              className="w-full"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Siguiendo
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Seguir
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Tarjeta de biografía */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sobre mí</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {profileData.bio || "Este usuario no ha añadido una biografía."}
            </p>
          </CardContent>
        </Card>
        
        {/* Tarjeta de estadísticas */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Estado del contenido */}
            <div>
              <h4 className="text-sm font-medium mb-2">Estado</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Completados
                  </span>
                  <span className="text-sm font-medium">{profileData.stats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    En progreso
                  </span>
                  <span className="text-sm font-medium">{profileData.stats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Pendientes
                  </span>
                  <span className="text-sm font-medium">{profileData.stats.planned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Abandonados
                  </span>
                  <span className="text-sm font-medium">{profileData.stats.dropped}</span>
                </div>
              </div>
            </div>
            
            {/* Tipos de contenido */}
            <div>
              <h4 className="text-sm font-medium mb-2">Tipo de contenido</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">{profileData.stats.movies}</div>
                  <div className="text-xs text-muted-foreground">Películas</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">{profileData.stats.series}</div>
                  <div className="text-xs text-muted-foreground">Series</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">{profileData.stats.books}</div>
                  <div className="text-xs text-muted-foreground">Libros</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">{profileData.stats.games}</div>
                  <div className="text-xs text-muted-foreground">Juegos</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Columna derecha - Pestañas de información */}
      <div className="lg:col-span-9">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="collection">Colección</TabsTrigger>
            <TabsTrigger value="friends">Amigos</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de actividad */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>Lo que {profileData.name} ha estado viendo últimamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivities.map(activity => (
                    <div key={activity.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-24 flex-shrink-0">
                        <Image
                          src={activity.content.image}
                          alt={activity.content.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <Badge className="mb-1">
                            {renderContentTypeIcon(activity.content.type)}
                            <span className="ml-1">{getContentTypeName(activity.content.type)}</span>
                          </Badge>
                          <h3 className="text-lg font-medium">{activity.content.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {profileData.name} {renderActivityType(activity.type)} este {getContentTypeName(activity.content.type).toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Cargar más</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Pestaña de colección */}
          <TabsContent value="collection" className="mt-6 space-y-6">
            {/* En progreso */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  En progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCollection.inProgress.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                      <div className="relative h-40 w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {renderContentTypeIcon(item.type)}
                          </Badge>
                        </div>
                        {item.progress && (
                          <div className="absolute bottom-2 right-2">
                            <Badge className="bg-blue-500">{item.progress}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Completados */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCollection.completed.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                      <div className="relative h-40 w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {renderContentTypeIcon(item.type)}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pendientes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCollection.planned.map(item => (
                    <div key={item.id} className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                      <div className="relative h-40 w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                            {renderContentTypeIcon(item.type)}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Pestaña de amigos */}
          <TabsContent value="friends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Amigos</CardTitle>
                <CardDescription>
                  {profileData.name} tiene {mockFriends.length} amigos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFriends.map(friend => (
                    <div key={friend.id} className="border rounded-lg p-4 flex items-center gap-4 hover:border-primary transition-colors cursor-pointer">
                      <UserAvatar avatarData={friend.avatar} size="lg" />
                      <div className="flex-1">
                        <h3 className="font-medium">{friend.name}</h3>
                        <p className="text-sm text-muted-foreground">@{friend.username}</p>
                        {friend.mutualFriends > 0 && (
                          <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <Users className="h-3 w-3 mr-1" />
                            {friend.mutualFriends} {friend.mutualFriends === 1 ? 'amigo en común' : 'amigos en común'}
                          </p>
                        )}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Seguir a {friend.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}