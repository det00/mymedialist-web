"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { AuthModal } from "@/components/ui/auth-modal";
import moment from "moment";
// Configurar locale español
moment.locale("es");

interface UserMedia {
  id: string;
  id_api: string;
  titulo: string;
  autor: string;
  genero: string[];
  imagen: string;
  estado: string;
  tipo: string;
}

interface Friend {
  id: string;
  nombre: string;
  iniciales: string;
  watching: string;
  color: string;
}

interface Recommendation {
  id: string;
  id_api: string;
  titulo: string;
  autor: string;
  genero: string[];
  imagen: string;
  tipo: string;
  recomendadoPor: string;
}

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  contentId: string;
  contentApiId: string;
  contentTitle: string;
  contentType: string;
  actionType: "started" | "finished" | "added" | "rated" | "dropped";
  timestamp: string;
  status?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mainViewTab, setMainViewTab] = useState<string>("content");
  const [userContent, setUserContent] = useState<UserMedia[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  // Mapeo de tipo a nombre completo
  const tipoCompleto: Record<string, string> = {
    P: "Película",
    S: "Serie",
    L: "Libro",
    V: "Videojuego",
  };

  // Mapeo de estado a color
  const estadoColor: Record<string, string> = {
    C: "#22c55e", // Completado - verde
    E: "#3b82f6", // En progreso - azul
    P: "#eab308", // Pendiente - amarillo
    A: "#ef4444", // Abandonado - rojo
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Simulamos carga de datos - En producción, se reemplazaría con APIs reales
    loadUserContent(storedToken);
    loadFriends(storedToken);
    loadRecommendations(storedToken);
    loadActivityFeed(storedToken);
  }, []);

  // Funciones para cargar datos
  const loadUserContent = async (token: string | null) => {
    try {
      // Si no hay token, usamos datos de ejemplo
      if (!token) {
        setUserContent(getFakeContent());
        return;
      }

      const response = await api.get("/user-content", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserContent(response.data || []);
    } catch (error) {
      console.error("Error al cargar contenido del usuario:", error);
      setUserContent(getFakeContent());
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async (token: string | null) => {
    try {
      // Si no hay token, usamos datos de ejemplo
      if (!token) {
        setFriends(getFakeFriends());
        return;
      }

      const response = await api.get("/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(response.data || []);
    } catch (error) {
      console.error("Error al cargar amigos:", error);
      setFriends(getFakeFriends());
    }
  };

  const loadRecommendations = async (token: string | null) => {
    try {
      // Si no hay token, usamos datos de ejemplo
      if (!token) {
        setRecommendations(getFakeRecommendations());
        return;
      }

      const response = await api.get("/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecommendations(response.data || []);
    } catch (error) {
      console.error("Error al cargar recomendaciones:", error);
      setRecommendations(getFakeRecommendations());
    }
  };
  
  const loadActivityFeed = async (token: string | null) => {
    try {
      // Si no hay token, usamos datos de ejemplo
      if (!token) {
        setActivityFeed(getFakeActivityFeed());
        return;
      }

      const response = await api.get("/activity-feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivityFeed(response.data || []);
    } catch (error) {
      console.error("Error al cargar feed de actividad:", error);
      setActivityFeed(getFakeActivityFeed());
    }
  };

  // Filtrar contenido por tipo
  const filteredContent = userContent.filter((item) => {
    if (activeTab === "all") return true;
    return item.tipo === activeTab;
  });

  // Datos de ejemplo para desarrollo
  const getFakeContent = (): UserMedia[] => [
    {
      id: "1",
      id_api: "tt0816692",
      titulo: "Interstellar",
      autor: "Christopher Nolan",
      genero: ["Sci-Fi", "Drama"],
      imagen: "https://via.placeholder.com/150x225",
      estado: "C",
      tipo: "P",
    },
    {
      id: "2",
      id_api: "tt0903747",
      titulo: "Breaking Bad",
      autor: "Vince Gilligan",
      genero: ["Drama", "Crimen"],
      imagen: "https://via.placeholder.com/150x225",
      estado: "E",
      tipo: "S",
    },
    {
      id: "3",
      id_api: "978-0307474728",
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      genero: ["Realismo mágico", "Ficción"],
      imagen: "https://via.placeholder.com/150x225",
      estado: "P",
      tipo: "L",
    },
    {
      id: "4",
      id_api: "zelda-botw",
      titulo: "The Legend of Zelda: Breath of the Wild",
      autor: "Nintendo",
      genero: ["Aventura", "Acción"],
      imagen: "https://via.placeholder.com/150x225",
      estado: "A",
      tipo: "V",
    },
  ];

  const getFakeFriends = (): Friend[] => [
    {
      id: "1",
      nombre: "Carlos Pérez",
      iniciales: "CP",
      watching: "Interstellar",
      color: "#6C5CE7",
    },
    {
      id: "2",
      nombre: "Ana Gómez",
      iniciales: "AG",
      watching: "The Office",
      color: "#22C55E",
    },
    {
      id: "3",
      nombre: "Miguel Rivas",
      iniciales: "MR",
      watching: "Dune",
      color: "#EAB308",
    },
  ];

  const getFakeRecommendations = (): Recommendation[] => [
    {
      id: "1",
      id_api: "tt3783958",
      titulo: "La La Land",
      autor: "Damien Chazelle",
      genero: ["Musical", "Drama"],
      imagen: "https://via.placeholder.com/150x225",
      tipo: "P",
      recomendadoPor: "Ana",
    },
  ];
  
  const getFakeActivityFeed = (): ActivityItem[] => [
    {
      id: "1",
      userId: "2",
      userName: "Ana Gómez",
      userInitials: "AG",
      userColor: "#22C55E",
      contentId: "5",
      contentApiId: "tt0903747",
      contentTitle: "Breaking Bad",
      contentType: "S",
      actionType: "finished",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
      status: "C"
    },
    {
      id: "2",
      userId: "3",
      userName: "Miguel Rivas",
      userInitials: "MR",
      userColor: "#EAB308",
      contentId: "6",
      contentApiId: "tt6468322",
      contentTitle: "Stranger Things",
      contentType: "S",
      actionType: "started",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
      status: "E"
    },
    {
      id: "3",
      userId: "4",
      userName: "Laura Sánchez",
      userInitials: "LS",
      userColor: "#3B82F6",
      contentId: "7",
      contentApiId: "tt7286456",
      contentTitle: "Joker",
      contentType: "P",
      actionType: "rated",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días atrás
    },
    {
      id: "4",
      userId: "2",
      userName: "Ana Gómez",
      userInitials: "AG",
      userColor: "#22C55E",
      contentId: "8",
      contentApiId: "tt1375666",
      contentTitle: "Inception",
      contentType: "P",
      actionType: "added",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
      status: "P"
    },
    {
      id: "5",
      userId: "5",
      userName: "Javier Martínez",
      userInitials: "JM",
      userColor: "#EF4444",
      contentId: "9",
      contentApiId: "tt2442560",
      contentTitle: "Peaky Blinders",
      contentType: "S",
      actionType: "dropped",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 días atrás
      status: "A"
    }
  ];

  // Manejar la adición de un amigo
  const handleAddFriend = () => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    // Lógica para añadir amigo
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

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-24 py-8">
      <Tabs 
        value={mainViewTab} 
        onValueChange={setMainViewTab}
        className="mb-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="content">Mi contenido</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-6">
          <main className="flex flex-col md:flex-row gap-8">
            {/* Columna izquierda: Contenido del usuario */}
            <div className="w-full md:w-3/4">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Mi contenido</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filtros por tipo */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                      variant={activeTab === "all" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveTab("all")}
                    >
                      Todo
                    </Button>
                    <Button
                      variant={activeTab === "P" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveTab("P")}
                    >
                      Películas
                    </Button>
                    <Button
                      variant={activeTab === "S" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveTab("S")}
                    >
                      Series
                    </Button>
                    <Button
                      variant={activeTab === "L" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveTab("L")}
                    >
                      Libros
                    </Button>
                    <Button
                      variant={activeTab === "V" ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveTab("V")}
                    >
                      Juegos
                    </Button>
                  </div>

                  {/* Grid de contenido */}
                  {loading ? (
                    <div className="text-center py-8">Cargando contenido...</div>
                  ) : filteredContent.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay contenido para mostrar
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredContent.map((item) => (
                        <Link
                          href={`/${
                            item.tipo === "P"
                              ? "pelicula"
                              : item.tipo === "S"
                              ? "serie"
                              : item.tipo === "L"
                              ? "libro"
                              : "videojuego"
                          }/${item.id_api}`}
                          key={item.id}
                        >
                          <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex gap-4">
                              <div className="relative flex-shrink-0 w-20 h-30">
                                <Image
                                  src={item.imagen}
                                  alt={item.titulo}
                                  width={80}
                                  height={120}
                                  className="rounded-md object-cover"
                                />
                              </div>
                              <div className="flex flex-col justify-between flex-1">
                                <div>
                                  <h3 className="font-bold line-clamp-2">
                                    {item.titulo}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.autor}
                                  </p>
                                  <p className="text-xs italic text-muted-foreground">
                                    {item.genero.join(", ")}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-muted-foreground">
                                    {tipoCompleto[item.tipo] || "Contenido"}
                                  </span>
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        estadoColor[item.estado] || "#94a3b8",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha: Amigos y recomendaciones */}
            <div className="w-full md:w-1/4 space-y-6">
              {/* Sección de amigos */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Amigos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {friends.length === 0 ? (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      Aún no tienes amigos
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-3 bg-muted rounded-md flex items-center gap-3"
                      >
                        <Avatar className="h-10 w-10" style={{ backgroundColor: friend.color }}>
                          <AvatarFallback className="text-white">
                            {friend.iniciales}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{friend.nombre}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            Viendo: {friend.watching}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  <Button
                    onClick={handleAddFriend}
                    className="w-full"
                    variant="default"
                  >
                    Añadir amigo
                  </Button>
                </CardContent>
              </Card>

              {/* Sección de recomendaciones */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Recomendado</CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations.length === 0 ? (
                    <div className="text-center py-2 text-sm text-muted-foreground">
                      No hay recomendaciones aún
                    </div>
                  ) : (
                    recommendations.map((rec) => (
                      <Link
                        href={`/${
                          rec.tipo === "P"
                            ? "pelicula"
                            : rec.tipo === "S"
                            ? "serie"
                            : rec.tipo === "L"
                            ? "libro"
                            : "videojuego"
                        }/${rec.id_api}`}
                        key={rec.id}
                      >
                        <div className="flex gap-3 cursor-pointer hover:bg-muted p-2 rounded-md transition-colors">
                          <div className="relative flex-shrink-0 w-16 h-24">
                            <Image
                              src={rec.imagen}
                              alt={rec.titulo}
                              width={60}
                              height={90}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-sm line-clamp-2">
                                {rec.titulo}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {rec.autor}
                              </p>
                              <p className="text-xs italic text-muted-foreground">
                                {rec.genero.join(", ")}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Recomendado por {rec.recomendadoPor}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              {activityFeed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay actividad reciente para mostrar
                </div>
              ) : (
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="p-4 border rounded-lg flex">
                        {/* Avatar del usuario */}
                        <div className="mr-4">
                          <Avatar className="h-12 w-12" style={{ backgroundColor: activity.userColor }}>
                            <AvatarFallback className="text-white text-base">
                              {activity.userInitials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        {/* Contenido */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-1">
                            <span className="font-medium">{activity.userName}</span>
                            <span className="text-muted-foreground">
                              {renderActionType(activity)}
                            </span>
                            <Link 
                              href={`/${
                                activity.contentType === "P"
                                  ? "pelicula"
                                  : activity.contentType === "S"
                                  ? "serie"
                                  : activity.contentType === "L"
                                  ? "libro"
                                  : "videojuego"
                              }/${activity.contentApiId}`}
                              className="font-medium hover:underline"
                            >
                              {activity.contentTitle}
                            </Link>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">
                              {moment(activity.timestamp).fromNow()}
                            </span>
                            
                            {/* Círculo de estado */}
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: getStatusColor(activity) }}
                            >
                              <div className="w-4 h-4 rounded-full bg-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Agregar una línea separadora excepto para el último elemento */}
                      {activityFeed.indexOf(activity) !== activityFeed.length - 1 && (
                        <div className="absolute left-[24px] top-[72px] bottom-[-28px] w-px bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de autenticación */}
      <AuthModal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        initialView="login"
      />
    </div>
  );
}