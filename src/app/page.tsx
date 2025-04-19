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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
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
  Users,
} from "lucide-react";
import { AuthModal } from "@/components/ui/auth-modal";
import { authService } from "@/lib/auth";
import { homeService, ContentItem } from "@/lib/home";

// Configurar locale español
moment.locale("es");

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Estados para datos de la API
  const [currentContent, setCurrentContent] = useState<ContentItem[]>([]);
  const [loadingCurrent, setLoadingCurrent] = useState<boolean>(true);

  const [watchlist, setWatchlist] = useState<ContentItem[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(true);

  const [trendingContent, setTrendingContent] = useState<ContentItem[]>([]);
  const [loadingTrending, setLoadingTrending] = useState<boolean>(true);

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

  // Cargar datos del usuario
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const userInfo = authService.getUserData();
        setUserData(userInfo);
      }

      setLoading(false);
    };

    checkAuth();

    // Listener para actualizaciones de autenticación
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("userDataUpdated", handleAuthChange);

    return () => {
      window.removeEventListener("userDataUpdated", handleAuthChange);
    };
  }, []);

  // Cargar contenido actual desde la API
  useEffect(() => {
    if (isAuthenticated) {
      const loadCurrentContent = async () => {
        setLoadingCurrent(true);
        try {
          const data = await homeService.getCurrentContent();
          setCurrentContent(data);

          // Establecer aleatoriamente uno de los contenidos en progreso como "viendo ahora"
          if (data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            setIsWatchingNow(data[randomIndex]);
          }
        } catch (error) {
          console.error("Error al cargar contenido en progreso:", error);
        } finally {
          setLoadingCurrent(false);
        }
      };

      loadCurrentContent();
    }
  }, [isAuthenticated]);

  // Cargar watchlist desde la API
  useEffect(() => {
    if (isAuthenticated) {
      const loadWatchlist = async () => {
        setLoadingWatchlist(true);
        try {
          const data = await homeService.getWatchlist();
          setWatchlist(data);
        } catch (error) {
          console.error("Error al cargar watchlist:", error);
        } finally {
          setLoadingWatchlist(false);
        }
      };

      loadWatchlist();
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
        } catch (error) {
          console.error("Error al cargar tendencias:", error);
        } finally {
          setLoadingTrending(false);
        }
      };

      loadTrending();
    }
  }, [isAuthenticated]);

  // Manejar seguir/dejar de seguir
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Aquí iría la lógica para seguir/dejar de seguir
    console.log("Toggle follow");
  };

  // Manejar compartir perfil
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Perfil de ${userData?.nombre || "usuario"} en MyMediaList`,
          text: `Échale un vistazo al perfil de ${
            userData?.nombre || "usuario"
          } en MyMediaList`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error al compartir:", err);
        });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      alert(`Comparte este enlace: ${window.location.href}`);
    }
  };

  // Filtrar contenido por tipo
  const filterContentByType = (content: ContentItem[], type: string) => {
    if (type === "all") return content;
    return content.filter((item) => item.tipo === type);
  };

  // Renderizar icono basado en tipo de contenido
  const renderContentTypeIcon = (tipo: string) => {
    const Icon = tipoInfo[tipo as keyof typeof tipoInfo]?.icon || Film;
    return <Icon className="h-4 w-4" />;
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
                            <span>
                              {moment(isWatchingNow.ultimaActividad).fromNow()}
                            </span>
                          </Badge>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="shadow-md"
                        >
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
                <TabsTrigger value="current">En progreso</TabsTrigger>
                <TabsTrigger value="watchlist">Por ver</TabsTrigger>
                <TabsTrigger value="trends">Tendencias</TabsTrigger>
              </TabsList>

              {/* Contenido en progreso */}
              <TabsContent value="current" className="space-y-6">
                {/* Filtro de tipos */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={
                      contentTypeFilter === "all" ? "default" : "outline"
                    }
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
                  {loadingCurrent ? (
                    // Loader para datos en carga
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : filterContentByType(currentContent, contentTypeFilter)
                      .length > 0 ? (
                    // Mostrar contenido filtrado
                    filterContentByType(currentContent, contentTypeFilter).map(
                      (item) => (
                        <Link
                          key={`${item.id || item.id_api}-${item.tipo}`}
                          href={`/${
                            item.tipo === "P"
                              ? "pelicula"
                              : item.tipo === "S"
                              ? "serie"
                              : item.tipo === "L"
                              ? "libro"
                              : "videojuego"
                          }/${item.id_api}`}
                        >
                          <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                            <div className="flex h-full">
                              <div className="w-1/3 relative">
                                <Image
                                  src={
                                    item.imagen ||
                                    "https://via.placeholder.com/300x450"
                                  }
                                  alt={item.titulo}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="w-2/3 p-4 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-bold line-clamp-2">
                                    {item.titulo}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.autor}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.genero
                                      ?.slice(0, 2)
                                      .map((gen, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {gen}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    {renderContentTypeIcon(item.tipo)}
                                    {
                                      tipoInfo[
                                        item.tipo as keyof typeof tipoInfo
                                      ]?.nombre
                                    }
                                  </Badge>
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        estadoColor[item.estado || "E"] ||
                                        "#94a3b8",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      )
                    )
                  ) : (
                    // Mensaje cuando no hay datos
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No hay tendencias entre tus amigos aún
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Añade amigos para ver qué contenido es popular
                        </p>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Añadir amigos
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Watchlist (Por ver) */}
              <TabsContent value="watchlist" className="space-y-6">
                {/* Lista de contenido por ver */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingWatchlist ? (
                    // Loader para datos en carga
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : watchlist.length > 0 ? (
                    // Mostrar contenido pendiente
                    watchlist.map((item) => (
                      <Link
                        key={`${item.id || item.id_api}-${item.tipo}`}
                        href={`/${
                          item.tipo === "P"
                            ? "pelicula"
                            : item.tipo === "S"
                            ? "serie"
                            : item.tipo === "L"
                            ? "libro"
                            : "videojuego"
                        }/${item.id_api}`}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                          <div className="flex h-full">
                            <div className="w-1/3 relative">
                              <Image
                                src={
                                  item.imagen ||
                                  "https://via.placeholder.com/300x450"
                                }
                                alt={item.titulo}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold line-clamp-2">
                                  {item.titulo}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.autor}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.genero?.slice(0, 2).map((gen, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {gen}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {renderContentTypeIcon(item.tipo)}
                                  {
                                    tipoInfo[item.tipo as keyof typeof tipoInfo]
                                      ?.nombre
                                  }
                                </Badge>
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      estadoColor[item.estado || "P"] ||
                                      "#94a3b8",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    // Mensaje cuando no hay datos
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground mb-4">
                        Tu lista de pendientes está vacía
                      </p>
                      <Link href="/busqueda?busqueda=&tipo=P">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Buscar contenido
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
              {/* Tendencias */}
              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loadingTrending ? (
                    // Loader para datos en carga
                    <div className="col-span-2 flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                  ) : trendingContent.length > 0 ? (
                    // Mostrar contenido en tendencia
                    trendingContent.map((item) => (
                      <Link
                        key={`trend-${item.id_api}-${item.tipo}`}
                        href={`/${
                          item.tipo === "P"
                            ? "pelicula"
                            : item.tipo === "S"
                            ? "serie"
                            : item.tipo === "L"
                            ? "libro"
                            : "videojuego"
                        }/${item.id_api}`}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                          <div className="flex h-full">
                            <div className="w-1/3 relative">
                              <Image
                                src={
                                  item.imagen ||
                                  "https://via.placeholder.com/300x450"
                                }
                                alt={item.titulo}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-4 flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold line-clamp-2">
                                  {item.titulo}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {item.autor}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.genero?.slice(0, 2).map((gen, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {gen}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  {renderContentTypeIcon(item.tipo)}
                                  {
                                    tipoInfo[item.tipo as keyof typeof tipoInfo]
                                      ?.nombre
                                  }
                                </Badge>
                                <Badge variant="secondary">
                                  <Users className="h-3 w-3 mr-1" />
                                  {item.numAmigos}{" "}
                                  {item.numAmigos === 1 ? "amigo" : "amigos"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    // Mensaje cuando no hay datos
                    <div className="col-span-2 flex flex-col items-center justify-center py-12">
                      <div className="flex flex-col items-center">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          No hay tendencias entre tus amigos aún
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Añade amigos para ver qué contenido es popular
                        </p>
                        <Button>
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
                  <Button variant="ghost" size="sm">
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
                    <div className="text-lg font-bold">
                      {currentContent.length + watchlist.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-blue-500">
                      {currentContent.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      En progreso
                    </div>
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <div className="text-lg font-bold text-amber-500">
                      {watchlist.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pendientes
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/perfil">
                    <Button variant="outline" size="sm" className="w-full">
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
                    <span>Amigos</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  Descubre qué están viendo tus amigos
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Aquí iría el componente de amigos pero lo dejaremos vacío para este ejemplo */}
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Aún no tienes amigos
                  </p>
                </div>

                <Button
                  onClick={handleFollowToggle}
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

                <Button variant="outline" size="sm" className="w-full mt-4">
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
