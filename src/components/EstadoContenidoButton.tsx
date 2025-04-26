"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
import moment from "moment";
import {
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
  Users,
} from "lucide-react";
import { AuthModal } from "@/components/ui/auth-modal";
import { authService } from "@/lib/auth";
import { homeService } from "@/lib/home";
import { ContentItem } from "@/lib/types";
import EstadoContenidoButton from "@/components/EstadoContenidoButton";
import { CardConEstado } from "@/components/CardConEstado";

// Configurar locale español
moment.locale("es");

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Estado para almacenar todos los contenidos
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);

  // Estados para tendencias
  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [loadingTrending, setLoadingTrending] = useState<boolean>(true);

  // Estado para contenido que se está viendo actualmente
  const [isWatchingNow, setIsWatchingNow] = useState<ContentItem | null>(null);

  // Estados para filtros
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

  // Mapeo de tipo a nombre completo e icono
  const tipoInfo = {
    P: { nombre: "Película", icon: Film },
    S: { nombre: "Serie", icon: Tv },
    L: { nombre: "Libro", icon: Library },
    V: { nombre: "Videojuego", icon: Gamepad2 },
  };

  // Mapeo de estado a color
  const estadoColor: Record<string, string> = {
    C: "#22c55e", // Completado - verde
    E: "#3b82f6", // En progreso - azul
    P: "#eab308", // Pendiente - amarillo
    A: "#ef4444", // Abandonado - rojo
  };

  // Función para verificar la autenticación y cargar datos del usuario
  const checkAuthAndLoadUserData = () => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const userInfo = authService.getUserData();
      setUserData(userInfo);
    } else {
      // Si no está autenticado, limpiar todos los datos personales
      setUserData(null);
      setAllContent([]);
      setTrendingContent([]);
      setIsWatchingNow(null);
    }

    setLoading(false);
  };

  // Cargar datos del usuario
  useEffect(() => {
    checkAuthAndLoadUserData();

    // Listener para actualizaciones de autenticación
    const handleAuthChange = () => {
      checkAuthAndLoadUserData();
    };

    // Listener para actualizaciones de estado de contenido
    const handleContentUpdate = (event: CustomEvent) => {
      const { id_api, tipo, estado } = event.detail;

      // Actualización optimista del estado local
      setAllContent((prevContent) =>
        prevContent.map((item) => {
          if (item.id_api === id_api && item.tipo === tipo) {
            return { ...item, estado };
          }
          return item;
        })
      );
    };

    // Escuchar eventos
    window.addEventListener("userDataUpdated", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(
      "contentStateUpdated",
      handleContentUpdate as EventListener
    );

    return () => {
      window.removeEventListener("userDataUpdated", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(
        "contentStateUpdated",
        handleContentUpdate as EventListener
      );
    };
  }, []);

  // Cargar todo el contenido
  useEffect(() => {
    if (isAuthenticated) {
      const loadContent = async () => {
        setLoadingContent(true);

        try {
          const data = await homeService.getContenido();
          setAllContent(data);

          const enProgreso = data.filter((item) => item.estado === "E");
          if (enProgreso.length > 0) {
            // Seleccionar un elemento aleatorio o el primero como "viendo ahora"
            setIsWatchingNow(enProgreso[0]);
          }
        } finally {
          setLoadingContent(false);
        }
      };

      loadContent();
    } else {
      // Si no está autenticado, limpiar datos
      setAllContent([]);
      setIsWatchingNow(null);
      setLoadingContent(false);
    }
  }, [isAuthenticated]);

  // Cargar tendencias desde la API
  useEffect(() => {
    if (isAuthenticated) {
      const loadTrending = async () => {
        setLoadingTrending(true);
        try {
          const data = await homeService.getTrending();
          setTrendingContent(data);
        } finally {
          setLoadingTrending(false);
        }
      };

      loadTrending();
    } else {
      setTrendingContent([]);
      setLoadingTrending(false);
    }
  }, [isAuthenticated]);

  // Obtener contenido en progreso filtrado del contenido total
  const getCurrentContent = () => {
    if (!allContent.length) return [];

    let filtered = allContent.filter((item) => item.estado === "E");

    // Aplicar filtro por tipo si es necesario
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter((item) => item.tipo === contentTypeFilter);
    }

    return filtered;
  };

  // Obtener watchlist filtrada del contenido total
  const getWatchlist = () => {
    if (!allContent.length) return [];

    let filtered = allContent.filter((item) => item.estado === "P");

    // Aplicar filtro por tipo si es necesario
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter((item) => item.tipo === contentTypeFilter);
    }

    return filtered;
  };

  // Función para manejar seguir/dejar de seguir
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Aquí iría la lógica para seguir/dejar de seguir
    console.log("Toggle follow");
  };

  // Renderizar icono basado en tipo de contenido
  const renderContentTypeIcon = (tipo: string) => {
    const Icon = tipoInfo[tipo as keyof typeof tipoInfo]?.icon || Film;
    return <Icon className="h-4 w-4" />;
  };

  // Manejar actualización de estado
  const handleUpdateSuccess = () => {
    // No es necesario hacer nada aquí, la actualización es optimista
    console.log("Estado actualizado correctamente");
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de bienvenida
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-extrabold">
              Bienvenido a MyMediaList
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Organiza y comparte todo lo que ves, lees y juegas en un solo
              lugar.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Button
              size="lg"
              className="w-full cursor-pointer"
              onClick={() => setShowAuthModal(true)}
            >
              Iniciar sesión
            </Button>

            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Button
                variant="link"
                className="p-0 h-auto cursor-pointer"
                onClick={() => {
                  setShowAuthModal(true);
                }}
              >
                Regístrate
              </Button>
            </p>
          </div>

          <div className="pt-8">
            <h2 className="text-xl font-bold mb-4">
              ¿Por qué usar MyMediaList?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Todo en un lugar</h3>
                  <p className="text-sm text-muted-foreground">
                    Organiza películas, series, libros y videojuegos en una sola
                    aplicación.
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

  // Obtener contenido filtrado para las tabs
  const currentContent = getCurrentContent();
  const watchlist = getWatchlist();

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
                        src={
                          isWatchingNow.imagen ||
                          "https://via.placeholder.com/500x300"
                        }
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
                          src={
                            isWatchingNow.imagen ||
                            "https://via.placeholder.com/200x300"
                          }
                          alt={isWatchingNow.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <Badge className="mb-2 bg-blue-500 hover:bg-blue-600">
                          Viendo ahora
                        </Badge>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {isWatchingNow.titulo}
                        </h2>
                        <p className="text-white/80 text-sm">
                          {isWatchingNow.autor}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="bg-background/20 text-white border-none"
                          >
                            {renderContentTypeIcon(isWatchingNow.tipo)}
                            <span className="ml-1">
                              {
                                tipoInfo[
                                  isWatchingNow.tipo as keyof typeof tipoInfo
                                ]?.nombre
                              }
                            </span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-background/20 text-white border-none"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Actualizado recientemente</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="shadow-md cursor-pointer"
                        >
                          Continuar
                        </Button>
                        
                        {/* Botón de estado */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <EstadoContenidoButton
                            id_api={isWatchingNow.id_api}
                            tipo={isWatchingNow.tipo}
                            estadoInicial={isWatchingNow.estado || "E"}
                            variant="badge"
                            compact={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de progreso */}
                <CardContent className="pt-16 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pestañas para navegar entre secciones */}
            <Tabs defaultValue="current" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="current" className="cursor-pointer">
                  En progreso
                </TabsTrigger>
                <TabsTrigger value="watchlist" className="cursor-pointer">
                  Por ver
                </TabsTrigger>
                <TabsTrigger value="trends" className="cursor-pointer">
                  Tendencias
                </TabsTrigger>
              </TabsList>

              {/* Filtro de tipos */}
              <div className="flex flex-wrap gap-2 pb-4">
                <Button
                  variant={contentTypeFilter === "all" ? "default" : "outline"}
                  className="rounded-full cursor-pointer"
                  onClick={() => setContentTypeFilter("all")}
                  size="sm"
                >
                  <ListFilter className="h-4 w-4 mr-1" /> Todo
                </Button>
                <Button
                  variant={contentTypeFilter === "P" ? "default" : "outline"}
                  className="rounded-full cursor-pointer"
                  onClick={() => setContentTypeFilter("P")}
                  size="sm"
                >
                  <Film className="h-4 w-4 mr-1" /> Películas
                </Button>
                <Button
                  variant={contentTypeFilter === "S" ? "default" : "outline"}
                  className="rounded-full cursor-pointer"
                  onClick={() => setContentTypeFilter("S")}
                  size="sm"
                >
                  <Tv className="h-4 w-4 mr-1" /> Series
                </Button>
                <Button
                  variant={contentTypeFilter === "L" ? "default" : "outline"}
                  className="rounded-full cursor-pointer"
                  onClick={() => setContentTypeFilter("L")}
                  size="sm"
                >
                  <Library className="h-4 w-4 mr-1" /> Libros
                </Button>
                <Button
                  variant={contentTypeFilter === "V" ? "default" : "outline"}
                  className="rounded-full cursor-pointer"
                  onClick={() => setContentTypeFilter("V")}
                  size="sm"
                >
                  <Gamepad2 className="h-4 w-4 mr-1" /> Juegos
                </Button>
              </div>

              {/* Contenido en progreso */}
              <TabsContent value="current" className="space-y-6">
                {/* Lista de contenido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingContent ? (
                    // Loader para datos en carga
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : currentContent.length > 0 ? (
                    // Mostrar contenido filtrado usando el componente CardConEstado
                    currentContent.map((item) => (
                      <CardConEstado 
                        key={`${item.id || item.id_api}-${item.tipo}`}
                        item={item}
                      />
                    ))
                  ) : (
                    // Mensaje cuando no hay datos
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No hay contenido en progreso
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Añade contenido a tu colección para verlo aquí
                        </p>
                        <Button className="cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir contenido
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Watchlist */}
              <TabsContent value="watchlist" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingContent ? (
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : watchlist.length > 0 ? (
                    watchlist.map((item) => (
                      <CardConEstado 
                        key={`${item.id || item.id_api}-${item.tipo}`}
                        item={item}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <div className="flex flex-col items-center">
                        <Library className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Tu lista de pendientes está vacía
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Añade contenido a tu lista para verlo más tarde
                        </p>
                        <Button className="cursor-pointer">
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir contenido
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Tendencias */}
              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingTrending ? (
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : trendingContent.length > 0 ? (
                    trendingContent.map((item) => (
                      <CardConEstado 
                        key={`trend-${item.id_api}-${item.tipo}`}
                        item={item}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No hay tendencias entre tus amigos aún
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Añade amigos para ver qué contenido es popular
                        </p>
                        <Button className="cursor-pointer">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Añadir amigos
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
                  <Button variant="ghost" size="sm" className="cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-4 mb-4">
                  <UserAvatar
                    avatarData={userData?.avatar || "avatar1"}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-medium">
                      {userData?.nombre || "Usuario"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold">{allContent.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-blue-500">
                      {allContent.filter((item) => item.estado === "E").length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      En progreso
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-amber-500">
                      {allContent.filter((item) => item.estado === "P").length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pendientes
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/perfil" className="cursor-pointer">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full cursor-pointer"
                    >
                      Ver perfil completo
                    </Button>
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
                    <span>Gente a la que sigues</span>
                  </div>
                </CardTitle>
                <CardDescription>Descubre qué están viendo</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Aquí iría el componente de amigos pero lo dejaremos vacío para este ejemplo */}
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Aún no sigues a nadie
                  </p>
                </div>

                <Button
                  onClick={handleFollowToggle}
                  className="w-full gap-2 cursor-pointer"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4" />
                  Buscar personas
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
                <CardDescription>
                  Lo más popular entre tus amigos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {!loadingTrending && trendingContent.length > 0 ? (
                  <div className="space-y-3">
                    {trendingContent.slice(0, 2).map((item) => (
                      <Link
                        key={`trend-mini-${item.id_api}`}
                        href={`/${
                          item.tipo === "P"
                            ? "pelicula"
                            : item.tipo === "S"
                            ? "serie"
                            : item.tipo === "L"
                            ? "libro"
                            : "videojuego"
                        }/${item.id_api}`}
                        className="cursor-pointer"
                      >
                        <div className="bg-muted rounded-md p-2 flex gap-3 cursor-pointer hover:bg-muted/80 transition-colors">
                          <div className="relative w-16 aspect-[2/3] flex-shrink-0">
                            <Image
                              src={
                                item.imagen ||
                                "https://via.placeholder.com/300x450"
                              }
                              alt={item.titulo}
                              fill
                              className="object-cover rounded-sm"
                            />
                            
                            {/* Botón de estado en miniatura */}
                            <div className="absolute bottom-0 right-0 m-1" onClick={(e) => e.stopPropagation()}>
                              <EstadoContenidoButton
                                id_api={item.id_api}
                                tipo={item.tipo}
                                estadoInicial={item.estado || ""}
                                variant="icon"
                                compact={true}
                                stopPropagation={true}
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">
                              {item.titulo}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {item.autor}
                            </p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {item.numAmigos} amigos
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : loadingTrending ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No hay tendencias disponibles
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 cursor-pointer"
                >
                  Ver más tendencias
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
  );
}

