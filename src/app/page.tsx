"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserAvatar } from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/ui/auth-modal";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Film,
  Gamepad2,
  Library,
  ListFilter,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Tv,
  UserPlus,
  Users
} from "lucide-react";

// Configurar locale español
moment.locale("es");

interface UserData {
  nombre: string;
  email: string;
  avatar: string;
}

interface UserMedia {
  id: string;
  id_api: string;
  titulo: string;
  autor: string;
  genero: string[];
  imagen: string;
  estado: string;
  tipo: string;
  ultimaActividad?: string;
}

interface Friend {
  id: string;
  nombre: string;
  iniciales: string;
  avatar: string;
  watching: string;
  tipoContenido: string;
  estadoContenido: string;
}

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  contentId: string;
  contentApiId: string;
  contentTitle: string;
  contentType: string;
  contentImage?: string;
  actionType: "started" | "finished" | "added" | "rated" | "dropped";
  timestamp: string;
  status?: string;
}

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  
  // Estados para datos
  const [currentContent, setCurrentContent] = useState<UserMedia[]>([]);
  const [watchlist, setWatchlist] = useState<UserMedia[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [isWatchingNow, setIsWatchingNow] = useState<UserMedia | null>(null);
  
  // Estados para filtros
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  // Mapeo de tipo a nombre completo e icono
  const tipoInfo = {
    "P": { nombre: "Película", icon: Film },
    "S": { nombre: "Serie", icon: Tv },
    "L": { nombre: "Libro", icon: Library },
    "V": { nombre: "Videojuego", icon: Gamepad2 }
  };

  // Mapeo de estado a color
  const estadoColor: Record<string, string> = {
    "C": "#22c55e", // Completado - verde
    "E": "#3b82f6", // En progreso - azul
    "P": "#eab308", // Pendiente - amarillo
    "A": "#ef4444", // Abandonado - rojo
  };
  
  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    // Simular tiempo de carga
    setTimeout(() => {
      const storedToken = localStorage.getItem("token");
      setIsAuthenticated(!!storedToken);
      
      if (storedToken) {
        try {
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          } else {
            // Datos de demostración
            const demoData = {
              nombre: "Usuario Demo",
              email: "demo@example.com",
              avatar: "avatar1"
            };
            localStorage.setItem("userData", JSON.stringify(demoData));
            setUserData(demoData);
          }
          
          // Cargar datos de ejemplo
          loadDemoContent();
          loadDemoFriends();
          loadDemoActivity();
          
        } catch (e) {
          console.error("Error al cargar datos de usuario:", e);
        }
      }
      
      setLoading(false);
    }, 600);
  }, []);
  
  // Funciones para cargar datos de demostración
  const loadDemoContent = () => {
    // Contenido en progreso
    const demoCurrentContent: UserMedia[] = [
      {
        id: "1",
        id_api: "tt0903747",
        titulo: "Breaking Bad",
        autor: "Vince Gilligan",
        genero: ["Drama", "Crimen"],
        imagen: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        estado: "E",
        tipo: "S",
        ultimaActividad: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "2",
        id_api: "tt1190634",
        titulo: "The Boys",
        autor: "Eric Kripke",
        genero: ["Acción", "Ciencia ficción"],
        imagen: "https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg",
        estado: "E",
        tipo: "S",
        ultimaActividad: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        id_api: "978-0307474728",
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        genero: ["Realismo mágico", "Ficción"],
        imagen: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg",
        estado: "E",
        tipo: "L",
        ultimaActividad: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Contenido para ver (pendiente)
    const demoWatchlist: UserMedia[] = [
      {
        id: "4",
        id_api: "tt6468322",
        titulo: "Stranger Things",
        autor: "The Duffer Brothers",
        genero: ["Drama", "Fantasía", "Ciencia ficción"],
        imagen: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        estado: "P",
        tipo: "S"
      },
      {
        id: "5",
        id_api: "tt10048342",
        titulo: "Dune",
        autor: "Denis Villeneuve",
        genero: ["Ciencia ficción", "Aventura"],
        imagen: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
        estado: "P",
        tipo: "P"
      },
      {
        id: "6",
        id_api: "zelda-botw",
        titulo: "The Legend of Zelda: Breath of the Wild",
        autor: "Nintendo",
        genero: ["Aventura", "Acción"],
        imagen: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_801/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
        estado: "P",
        tipo: "V"
      }
    ];
    
    // Establecer aleatoriamente uno de los contenidos en progreso como "viendo ahora"
    const randomIndex = Math.floor(Math.random() * demoCurrentContent.length);
    setIsWatchingNow(demoCurrentContent[randomIndex]);
    
    setCurrentContent(demoCurrentContent);
    setWatchlist(demoWatchlist);
  };
  
  const loadDemoFriends = () => {
    setFriends([
      {
        id: "1",
        nombre: "Carlos Pérez",
        iniciales: "CP",
        avatar: "avatar2",
        watching: "Interstellar",
        tipoContenido: "P",
        estadoContenido: "E"
      },
      {
        id: "2",
        nombre: "Ana Gómez",
        iniciales: "AG",
        avatar: "initial_#E84393_AG",
        watching: "The Office",
        tipoContenido: "S",
        estadoContenido: "E"
      },
      {
        id: "3",
        nombre: "Miguel Rivas",
        iniciales: "MR",
        avatar: "avatar3",
        watching: "Dune",
        tipoContenido: "P",
        estadoContenido: "P"
      },
      {
        id: "4",
        nombre: "Laura Sánchez",
        iniciales: "LS",
        avatar: "initial_#0984E3_LS",
        watching: "Demon Slayer",
        tipoContenido: "S",
        estadoContenido: "E"
      },
      {
        id: "5",
        nombre: "Pablo Martín",
        iniciales: "PM",
        avatar: "avatar4",
        watching: "1984",
        tipoContenido: "L",
        estadoContenido: "C"
      }
    ]);
  };
  
  const loadDemoActivity = () => {
    setActivityFeed([
      {
        id: "1",
        userId: "2",
        userName: "Ana Gómez",
        userAvatar: "initial_#E84393_AG",
        contentId: "5",
        contentApiId: "tt0903747",
        contentTitle: "Breaking Bad",
        contentType: "S",
        contentImage: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
        actionType: "finished",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "C"
      },
      {
        id: "2",
        userId: "3",
        userName: "Miguel Rivas",
        userAvatar: "avatar3",
        contentId: "6",
        contentApiId: "tt6468322",
        contentTitle: "Stranger Things",
        contentType: "S",
        contentImage: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
        actionType: "started",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: "E"
      },
      {
        id: "3",
        userId: "4",
        userName: "Laura Sánchez",
        userAvatar: "initial_#0984E3_LS",
        contentId: "7",
        contentApiId: "tt7286456",
        contentTitle: "Joker",
        contentType: "P",
        contentImage: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
        actionType: "rated",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "4",
        userId: "2",
        userName: "Ana Gómez",
        userAvatar: "initial_#E84393_AG",
        contentId: "8",
        contentApiId: "tt1375666",
        contentTitle: "Inception",
        contentType: "P",
        contentImage: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        actionType: "added",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "P"
      },
      {
        id: "5",
        userId: "5",
        userName: "Pablo Martín",
        userAvatar: "avatar4",
        contentId: "9",
        contentApiId: "tt2442560",
        contentTitle: "Peaky Blinders",
        contentType: "S",
        contentImage: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
        actionType: "dropped",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "A"
      }
    ]);
  };

  // Filtrar contenido por tipo
  const filterContentByType = (content: UserMedia[], type: string) => {
    if (type === "all") return content;
    return content.filter(item => item.tipo === type);
  };

  // Función para manejar click en "Añadir amigo"
  const handleAddFriend = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    // Aquí iría la lógica para añadir amigos
    console.log("Añadir amigo");
  };
  
  // Función para renderizar el tipo de acción en español
  const renderActionType = (activity: ActivityItem) => {
    switch (activity.actionType) {
      case "started":
        return "ha empezado a ver";
      case "finished":
        return "ha terminado";
      case "added":
        return "ha añadido a su lista";
      case "rated":
        return "ha valorado";
      case "dropped":
        return "ha abandonado";
      default:
        return "ha actualizado";
    }
  };

  // Función para renderizar color basado en estado o acción
  const getStatusColor = (activity: ActivityItem) => {
    if (activity.status) {
      return estadoColor[activity.status] || "#94a3b8";
    }
    
    switch (activity.actionType) {
      case "finished":
        return "#22c55e"; // verde
      case "started":
        return "#3b82f6"; // azul
      case "added":
        return "#eab308"; // amarillo
      case "rated":
        return "#8b5cf6"; // violeta
      case "dropped":
        return "#ef4444"; // rojo
      default:
        return "#94a3b8"; // gris
    }
  };
  
  // Renderizar icono basado en tipo de contenido
  const renderContentTypeIcon = (tipo: string) => {
    const Icon = tipoInfo[tipo as keyof typeof tipoInfo]?.icon || Film;
    return <Icon className="h-4 w-4" />;
  };

  // Si no está autenticado, mostrar pantalla de bienvenida
  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-extrabold">Bienvenido a MyMediaList</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Organiza y comparte todo lo que ves, lees y juegas en un solo lugar.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 mt-6">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => setShowAuthModal(true)}
            >
              Iniciar sesión
            </Button>
            
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => {
                  setShowAuthModal(true);
                }}
              >
                Regístrate
              </Button>
            </p>
          </div>
          
          <div className="pt-8">
            <h2 className="text-xl font-bold mb-4">¿Por qué usar MyMediaList?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Todo en un lugar</h3>
                  <p className="text-sm text-muted-foreground">
                    Organiza películas, series, libros y videojuegos en una sola aplicación.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Conecta con amigos</h3>
                  <p className="text-sm text-muted-foreground">
                    Descubre qué ven tus amigos y comparte recomendaciones.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <AuthModal
          showModal={showAuthModal}
          setShowModal={setShowAuthModal}
          initialView="login"
        />
      </div>
    );
  }

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium">Cargando tu contenido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pt-4">
      <div className="container mx-auto px-4">
        {/* Grid principal - división entre contenido propio y amigos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna izquierda: Contenido del usuario (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Sección "Viendo ahora" */}
            {isWatchingNow && (
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="relative">
                  {/* Imagen de fondo con overlay */}
                  <div className="w-full h-48 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
                      <Image
                        src={isWatchingNow.imagen}
                        alt={isWatchingNow.titulo}
                        fill
                        className="object-cover opacity-50"
                      />
                    </div>
                  </div>
                  
                  {/* Contenido superpuesto */}
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex items-start gap-4">
                      {/* Póster */}
                      <div className="relative w-24 h-36 rounded-md overflow-hidden border-2 border-background shadow-md">
                        <Image
                          src={isWatchingNow.imagen}
                          alt={isWatchingNow.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1">
                        <Badge className="mb-2 bg-blue-500 hover:bg-blue-600">Viendo ahora</Badge>
                        <h2 className="text-xl font-bold text-white mb-1">{isWatchingNow.titulo}</h2>
                        <p className="text-white/80 text-sm">{isWatchingNow.autor}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="bg-background/20 text-white border-none">
                            {renderContentTypeIcon(isWatchingNow.tipo)}
                            <span className="ml-1">{tipoInfo[isWatchingNow.tipo as keyof typeof tipoInfo]?.nombre}</span>
                          </Badge>
                          <Badge variant="outline" className="bg-background/20 text-white border-none">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{moment(isWatchingNow.ultimaActividad).fromNow()}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Botones de acción */}
                      <div>
                        <Button variant="secondary" size="sm" className="shadow-md">
                          Continuar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sección de progreso */}
                <CardContent className="pt-16 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Pestañas para navegar entre secciones */}
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="current">En progreso</TabsTrigger>
                <TabsTrigger value="watchlist">Por ver</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>
              
              {/* Contenido en progreso */}
              <TabsContent value="current" className="space-y-6">
                {/* Filtro de tipos */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={contentTypeFilter === "all" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setContentTypeFilter("all")}
                    size="sm"
                  >
                    <ListFilter className="h-4 w-4 mr-1" /> Todo
                  </Button>
                  <Button
                    variant={contentTypeFilter === "P" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setContentTypeFilter("P")}
                    size="sm"
                  >
                    <Film className="h-4 w-4 mr-1" /> Películas
                  </Button>
                  <Button
                    variant={contentTypeFilter === "S" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setContentTypeFilter("S")}
                    size="sm"
                  >
                    <Tv className="h-4 w-4 mr-1" /> Series
                  </Button>
                  <Button
                    variant={contentTypeFilter === "L" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setContentTypeFilter("L")}
                    size="sm"
                  >
                    <Library className="h-4 w-4 mr-1" /> Libros
                  </Button>
                  <Button
                    variant={contentTypeFilter === "V" ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setContentTypeFilter("V")}
                    size="sm"
                  >
                    <Gamepad2 className="h-4 w-4 mr-1" /> Juegos
                  </Button>
                </div>
                
                {/* Lista de contenido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterContentByType(currentContent, contentTypeFilter).length > 0 ? (
                    filterContentByType(currentContent, contentTypeFilter).map((item) => (
                      <Link key={item.id} href={`/${
                        item.tipo === "P" ? "pelicula" :
                        item.tipo === "S" ? "serie" :
                        item.tipo === "L" ? "libro" : "videojuego"
                      }/${item.id_api}`}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                          <div className="flex h-full">
                            <div className="w-1/3 relative">
                              <Image
                                src={item.imagen}
                                alt={item.titulo}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold line-clamp-2">{item.titulo}</h3>
                                <p className="text-sm text-muted-foreground">{item.autor}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.genero.slice(0, 2).map((gen, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {gen}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {renderContentTypeIcon(item.tipo)}
                                  {tipoInfo[item.tipo as keyof typeof tipoInfo]?.nombre}
                                </Badge>
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: estadoColor[item.estado] || "#94a3b8" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 flex justify-center items-center py-12">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">Tu lista de pendientes está vacía</p>
                        <Button>Buscar contenido</Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Feed de actividad */}
              <TabsContent value="activity" className="space-y-6">
                <h2 className="text-xl font-bold">Actividad reciente</h2>
                
                {activityFeed.length > 0 ? (
                  <div className="space-y-4">
                    {activityFeed.map((activity) => (
                      <Card key={activity.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Avatar del usuario */}
                            <UserAvatar avatarData={activity.userAvatar} size="lg" />
                            
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 mb-2">
                                <span className="font-medium">{activity.userName}</span>
                                <span className="text-muted-foreground text-sm">
                                  {renderActionType(activity)}
                                </span>
                                <Link 
                                  href={`/${
                                    activity.contentType === "P" ? "pelicula" :
                                    activity.contentType === "S" ? "serie" :
                                    activity.contentType === "L" ? "libro" : "videojuego"
                                  }/${activity.contentApiId}`}
                                  className="font-medium hover:underline"
                                >
                                  {activity.contentTitle}
                                </Link>
                              </div>
                              
                              {activity.contentImage && (
                                <div className="relative w-full h-40 rounded-md overflow-hidden my-2">
                                  <Image
                                    src={activity.contentImage}
                                    alt={activity.contentTitle}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" /> {moment(activity.timestamp).fromNow()}
                                </span>
                                
                                <Badge style={{ backgroundColor: getStatusColor(activity), color: "white" }}>
                                  {activity.actionType === "rated" ? "Valorado" : 
                                   activity.actionType === "started" ? "En progreso" :
                                   activity.actionType === "finished" ? "Completado" :
                                   activity.actionType === "added" ? "Añadido" :
                                   activity.actionType === "dropped" ? "Abandonado" : "Actualizado"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Botón para cargar más actividad */}
                    <div className="flex justify-center">
                      <Button variant="outline">Cargar más</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">No hay actividad reciente</p>
                      <Button>Añadir contenido para generar actividad</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Columna derecha: Social (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tarjeta de perfil */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Mi perfil</span>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-4 mb-4">
                  <UserAvatar avatarData={userData?.avatar || "avatar1"} size="lg" />
                  <div>
                    <h3 className="font-medium">{userData?.nombre || "Usuario"}</h3>
                    <p className="text-sm text-muted-foreground">{userData?.email || ""}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold">{currentContent.length + watchlist.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-blue-500">{currentContent.length}</div>
                    <div className="text-xs text-muted-foreground">En progreso</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-amber-500">{watchlist.length}</div>
                    <div className="text-xs text-muted-foreground">Pendientes</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link href="/perfil">
                    <Button variant="outline" size="sm" className="w-full">Ver perfil completo</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Sección de amigos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Amigos</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Descubre qué están viendo tus amigos</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {friends.length > 0 ? (
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div 
                        key={friend.id} 
                        className="p-2 rounded-md hover:bg-muted transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar avatarData={friend.avatar} />
                          <div>
                            <p className="font-medium text-sm">{friend.nombre}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>Viendo:</span>
                              <span className="truncate max-w-[120px]">{friend.watching}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: estadoColor[friend.estadoContenido] || "#94a3b8" }}
                        ></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      Aún no tienes amigos
                    </p>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <Button 
                  onClick={handleAddFriend}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4" />
                  Añadir amigo
                </Button>
              </CardContent>
            </Card>
            
            {/* Sección de tendencias */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Tendencias</span>
                </CardTitle>
                <CardDescription>Lo más popular entre tus amigos</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="bg-muted rounded-md p-2 flex gap-3 cursor-pointer hover:bg-muted/80 transition-colors">
                    <div className="relative w-16 aspect-[2/3] flex-shrink-0">
                      <Image
                        src="https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
                        alt="Inception"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Inception</h4>
                      <p className="text-xs text-muted-foreground">Christopher Nolan</p>
                      <Badge variant="secondary" className="mt-2 text-xs">3 amigos viendo</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-2 flex gap-3 cursor-pointer hover:bg-muted/80 transition-colors">
                    <div className="relative w-16 aspect-[2/3] flex-shrink-0">
                      <Image
                        src="https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"
                        alt="Breaking Bad"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Breaking Bad</h4>
                      <p className="text-xs text-muted-foreground">Vince Gilligan</p>
                      <Badge variant="secondary" className="mt-2 text-xs">2 amigos viendo</Badge>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Button variant="outline" size="sm" className="w-full">
                  Ver más tendencias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modal de autenticación */}
      <AuthModal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        initialView="login"
      />
    </div>
  );
}