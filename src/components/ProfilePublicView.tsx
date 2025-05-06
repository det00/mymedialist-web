"use client";

import { useState } from "react";
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
import {
  Calendar,
  Users,
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  UserPlus,
  UserCheck,
  Share2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProfile } from "@/hooks/useProfile";
import { useActivity } from "@/hooks/useActivity";
import useCollection from "@/hooks/useCollection";
import Link from "next/link";


export function ProfilePublicView({ idUsuario }: { idUsuario: number }) {
  const [activeTab, setActiveTab] = useState("activity");
  const [isFollowing, setIsFollowing] = useState(false);
  const { datosPerfil, loading, seguidos, seguidores } = useProfile(idUsuario);
  const { activities } = useActivity(idUsuario);
  const { 
    enProgreso, 
    completado, 
    pendiente, 
    abandonado, 
    pelicula, 
    serie, 
    libro, 
    juego,
    loading: loadingCollection
  } = useCollection({ userId: idUsuario, autoLoad: true });

  // Condición de carga para mostrar el spinner
  if ((loading || loadingCollection) && !datosPerfil) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  // Manejar seguir/dejar de seguir
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // Manejar compartir perfil
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Perfil de ${datosPerfil?.nombre} en MyMediaList`,
          text: `Échale un vistazo al perfil de ${datosPerfil?.nombre} en MyMediaList`,
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

  // Función auxiliar para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Función auxiliar para renderizar tipo de actividad
  const renderActivityType = (estado: string) => {
    switch (estado) {
      case "C":
        return "ha completado";
      case "E":
        return "ha empezado";
      case "P":
        return "ha añadido";
      case "A":
        return "ha abandonado";
      default:
        return "ha actualizado";
    }
  };

  // Función auxiliar para renderizar ícono de tipo de contenido
  const renderContentTypeIcon = (tipo: string) => {
    switch (tipo) {
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

  // Función auxiliar para obtener nombre completo del tipo
  const getContentTypeName = (tipo: string) => {
    switch (tipo) {
      case "P":
        return "Película";
      case "S":
        return "Serie";
      case "L":
        return "Libro";
      case "V":
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
              {<UserAvatar
                avatarData={datosPerfil?.avatar_id || datosPerfil?.avatar}
                size="xl"
                className="mb-4"
              />}
              <h2 className="text-xl font-bold">{datosPerfil?.name || datosPerfil?.nombre}</h2>
              <p className="text-muted-foreground text-sm">
                @{datosPerfil?.username}
              </p>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Miembro desde{" "}
                {new Date(datosPerfil?.fechaRegistro || "").toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                  }
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <div className="text-center">
                  <p className="font-bold">{datosPerfil?.totalContenidos}</p>
                  <p className="text-xs text-muted-foreground">Contenido</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold">{seguidores.length}</p>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="text-center">
                  <p className="font-bold">{seguidos.length}</p>
                  <p className="text-xs text-muted-foreground">Siguiendo</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center gap-2 pt-0 pb-6 me-10 ms-10">
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollowToggle}
              className="w-full"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-2 mr-1" />
                  Siguiendo
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-2 mr-1" />
                  Seguir
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
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
              {datosPerfil?.bio || "Este usuario no ha añadido una biografía."}
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
                  <span className="text-sm font-medium">{completado.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    En progreso
                  </span>
                  <span className="text-sm font-medium">
                    {enProgreso.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Pendientes
                  </span>
                  <span className="text-sm font-medium">
                    {pendiente.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Abandonados
                  </span>
                  <span className="text-sm font-medium">
                    {abandonado.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Tipos de contenido */}
            <div>
              <h4 className="text-sm font-medium mb-2">Tipo de contenido</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">
                    {pelicula.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Películas</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">
                    {serie.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Series</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">
                    {libro.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Libros</div>
                </div>
                <div className="bg-muted p-2 rounded-md text-center">
                  <div className="text-lg font-bold">
                    {juego.length}
                  </div>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity" className="cursor-pointer">Actividad</TabsTrigger>
            <TabsTrigger value="collection" className="cursor-pointer">Colección</TabsTrigger>
            {/* <TabsTrigger value="friends" className="cursor-pointer">Amigos</TabsTrigger> */}
          </TabsList>

          {/* Pestaña de actividad */}
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
                <CardDescription>
                  Lo que {datosPerfil?.nombre} ha estado viendo últimamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    if (!activities || activities.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No hay actividad reciente</p>
                        </div>
                      );
                    }

                    // Filtrar actividades duplicadas por ID
                    const seen = new Set();
                    return activities
                      .filter((a) => {
                        if (seen.has(a.id)) return false;
                        seen.add(a.id);
                        return true;
                      })
                      .map((activity) => (
                        <div key={activity.id} className="flex gap-4 p-4 border rounded-lg">
                          <div className="relative w-16 h-24 flex-shrink-0">
                            {activity.imagen ? (
                              <Image
                                src={activity.imagen}
                                alt={activity.titulo}
                                fill
                                className="object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                                {renderContentTypeIcon(activity.tipo)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <Badge className="mb-1">
                                {renderContentTypeIcon(activity.tipo)}
                                <span className="ml-1">
                                  {getContentTypeName(activity.tipo)}
                                </span>
                              </Badge>
                              <h3 className="text-lg font-medium">{activity.titulo}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {(datosPerfil?.name || datosPerfil?.nombre)} {renderActivityType(activity.estado)} este{" "}
                              {getContentTypeName(activity.tipo).toLowerCase()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.created_at || activity.updated_at)}
                            </p>
                          </div>
                        </div>
                      ));
                  })()} 
                </div>

              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Cargar más
                </Button>
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
                  {enProgreso && enProgreso.length > 0 ? enProgreso.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="relative h-40 w-full">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.titulo}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-40 w-full bg-muted flex items-center justify-center">
                            {renderContentTypeIcon(item.tipo)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            {renderContentTypeIcon(item.tipo)}
                          </Badge>
                        </div>
                        {item.estado && (
                          <div className="absolute bottom-2 right-2">
                            <Badge className="bg-blue-500">
                              {item.estado === "E" ? "En progreso" : item.estado}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">
                          {item.titulo}
                        </h3>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-muted-foreground">No hay contenido en progreso</p>
                    </div>
                  )}
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
                  {completado && completado.length > 0 ? completado.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="relative h-40 w-full">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.titulo}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-40 w-full bg-muted flex items-center justify-center">
                            {renderContentTypeIcon(item.tipo)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            {renderContentTypeIcon(item.tipo)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-green-500">
                            Completado
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">
                          {item.titulo}
                        </h3>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-muted-foreground">No hay contenido completado</p>
                    </div>
                  )}
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
                  {pendiente && pendiente.length > 0 ? pendiente.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden group cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="relative h-40 w-full">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.titulo}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-40 w-full bg-muted flex items-center justify-center">
                            {renderContentTypeIcon(item.tipo)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-sm"
                          >
                            {renderContentTypeIcon(item.tipo)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-yellow-500">
                            Pendiente
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-sm truncate">
                          {item.titulo}
                        </h3>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-muted-foreground">No hay contenido pendiente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de amigos */}
          {/* <TabsContent value="friends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Amigos</CardTitle>
                <CardDescription>
                  {datosPerfil.nombre} tiene {seguidos.length} amigos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seguidos.map((friend) => (
                    <Link href={`/perfil/${friend.id}`} key={friend.id}>
                      <div
                        className="border rounded-lg p-4 flex items-center gap-4 hover:border-primary transition-colors cursor-pointer"
                      >
                        <UserAvatar avatarData={friend.avatar} size="lg" />
                        <div className="flex-1">
                          <h3 className="font-medium">{friend.nombre}</h3>
                          <p className="text-sm text-muted-foreground">
                            @{friend.username}
                          </p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Seguir a {friend.nombre}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
