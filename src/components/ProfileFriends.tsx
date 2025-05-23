import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {UserAvatar} from "@/components/UserAvatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Search,
  Users,
  UserPlus,
  FilmIcon,
  TvIcon,
  BookOpenIcon,
  Gamepad2Icon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {AddAmigo} from "./AddAmigo";
import {Seguidor} from "@/lib/types";
import amigosService from "@/lib/amigos";
import Link from "next/link";

export function ProfileFriends() {
  const [activeTab, setActiveTab] = useState("seguidos");
  const [querySeguidores, setQuerySeguidores] = useState("");
  const [querySeguidos, setQuerySeguidos] = useState("");

  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("recent");
  const userId = Number(localStorage.getItem("id_usuario"));

  const { data: seguidores = [], refetch: refetchSeguidores } = useQuery({
    queryKey: ["seguidores", userId],
    queryFn: () => amigosService.getSeguidores(userId),
  });

  const { data: seguidos = [], refetch: refetchSeguidos } = useQuery({
    queryKey: ["seguidos", userId],
    queryFn: () => amigosService.getSeguidos(userId),
  });

  // Manejar búsqueda
  const handleSearchSeguidores = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuerySeguidores(e.target.value);
  };
  const handleSearchSeguidos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuerySeguidos(e.target.value);
  };

  // Filtrar amigos según búsqueda
  const busquedaSeguidores = seguidores.filter(
    (friend) =>
      friend.nombre.toLowerCase().includes(querySeguidores.toLowerCase()) ||
      friend.username.toLowerCase().includes(querySeguidores.toLowerCase())
  );

  const busquedaSeguidos = seguidos.filter(
    (friend) =>
      friend.nombre.toLowerCase().includes(querySeguidos.toLowerCase()) ||
      friend.username.toLowerCase().includes(querySeguidos.toLowerCase())
  );

  // Ordenar amigos según la opción seleccionada
  const seguidoresOrdenados = [...busquedaSeguidores].sort((a, b) => {
    switch (selectedSortOption) {
      case "recent":
        return (
          new Date(b.ultimaActividad.fecha).getTime() -
          new Date(a.ultimaActividad.fecha).getTime()
        );
      case "name":
        return a.nombre.localeCompare(b.nombre);
      default:
        return 0;
    }
  });
  const seguidosOrdenados = [...busquedaSeguidos].sort((a, b) => {
    switch (selectedSortOption) {
      case "recent":
        return (
          new Date(b.ultimaActividad.fecha).getTime() -
          new Date(a.ultimaActividad.fecha).getTime()
        );
      case "name":
        return a.nombre.localeCompare(b.nombre);
      default:
        return 0;
    }
  });

  // Función para obtener icono según tipo de contenido
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <FilmIcon className="h-4 w-4"/>;
      case "series":
        return <TvIcon className="h-4 w-4"/>;
      case "book":
        return <BookOpenIcon className="h-4 w-4"/>;
      case "game":
        return <Gamepad2Icon className="h-4 w-4"/>;
      default:
        return <FilmIcon className="h-4 w-4"/>;
    }
  };

  // Función para formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seguidos" className="cursor-pointer">
            Seguidos
          </TabsTrigger>
          <TabsTrigger value="seguidores" className="cursor-pointer">
            Seguidores
          </TabsTrigger>
        </TabsList>

        {/* SOCIAL */}
        <TabsContent value="seguidores" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Mis amigos</CardTitle>
                <Button onClick={() => setShowAddFriendDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2"/>
                  Añadir amigo
                </Button>
              </div>
              <CardDescription>
                Tienes {seguidores.length} seguidores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barra de búsqueda y filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Buscar amigos..."
                    value={querySeguidores}
                    onChange={handleSearchSeguidores}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Lista de seguidores */}
              {seguidoresOrdenados.length > 0 ? (
                <div className="space-y-3">
                  {seguidoresOrdenados.map((friend) => (
                    <Link href={`/perfil/${friend.id}`} key={friend.id}>
                      <div
                        className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer mb-2">
                        <div className="flex items-start gap-4">
                          {/* Avatar e información básica */}
                          <div className="relative">
                            <UserAvatar avatarData={friend.avatar} size="lg"/>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{friend.nombre}</h3>
                                <p className="text-sm text-muted-foreground">
                                  @{friend.username}
                                </p>
                              </div>
                            </div>

                            {/* Información adicional */}
                            <div className="mt-2 space-y-2">
                              {/* Actividad reciente */}
                              {friend.ultimaActividad && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">
                                    Actividad reciente:{" "}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {getContentTypeIcon(
                                      friend.ultimaActividad.tipo
                                    )}
                                    <span>{friend.ultimaActividad.titulo}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs ml-2"
                                    >
                                      {formatRelativeTime(
                                        friend.ultimaActividad.fecha
                                      )}
                                    </Badge>
                                  </span>
                                </div>
                              )}

                              {/* Etiquetas adicionales */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                  {friend.contenidosTotales} contenidos
                                </Badge>
                                <Badge variant="outline">
                                  {friend.contenidosCompartidos} coincidencias
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Users className="h-12 w-12 text-muted-foreground mb-4"/>
                  <h3 className="text-lg font-medium mb-2">
                    No se encontraron amigos
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    No se encontraron resultados para &quot;{querySeguidores}
                    &quot;. Intenta con otro término de búsqueda.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {busquedaSeguidores.length > 0 && (
                <Button variant="outline" className="w-full cursor-pointer">
                  Ver todos los amigos
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de seguidos */}
        <TabsContent value="seguidos" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Mis amigos</CardTitle>
                <Button onClick={() => setShowAddFriendDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2"/>
                  Añadir amigo
                </Button>
              </div>
              <CardDescription>
                Tienes {seguidos.length} seguidores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barra de búsqueda y filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Buscar amigos..."
                    value={querySeguidos}
                    onChange={handleSearchSeguidos}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Lista de seguidos */}
              {seguidosOrdenados.length > 0 ? (
                <div className="space-y-3">
                  {seguidosOrdenados.map((friend) => (
                    <Link
                      href={`/perfil/${friend.id}`}
                      key={friend.id}
                    >
                      <div
                        key={friend.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors mb-2"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar e información básica */}
                          <div className="relative">
                            <UserAvatar avatarData={friend.avatar} size="lg"/>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{friend.nombre}</h3>
                                <p className="text-sm text-muted-foreground">
                                  @{friend.username}
                                </p>
                              </div>
                            </div>

                            {/* Información adicional */}
                            <div className="mt-2 space-y-2">
                              {/* Actividad reciente */}
                              {friend.ultimaActividad && (
                                <div className="text-sm">
                                <span className="text-muted-foreground">
                                  Actividad reciente:{" "}
                                </span>
                                  <span className="flex items-center gap-1">
                                  {getContentTypeIcon(
                                    friend.ultimaActividad.tipo
                                  )}
                                    <span>{friend.ultimaActividad.titulo}</span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-2"
                                  >
                                    {formatRelativeTime(
                                      friend.ultimaActividad.fecha
                                    )}
                                  </Badge>
                                </span>
                                </div>
                              )}

                              {/* Etiquetas adicionales */}
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                  {friend.contenidosTotales} contenidos
                                </Badge>
                                <Badge variant="outline">
                                  {friend.contenidosCompartidos} coincidencias
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Users className="h-12 w-12 text-muted-foreground mb-4"/>
                  <h3 className="text-lg font-medium mb-2">
                    No se encontraron amigos
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    No se encontraron resultados para &quot;{querySeguidos}
                    &quot;. Intenta con otro término de búsqueda.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {busquedaSeguidos.length > 0 && (
                <Button variant="outline" className="w-full cursor-pointer">
                  Ver todos los amigos
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para añadir amigo */}
      <AddAmigo
        open={showAddFriendDialog}
        cerrarAddAmigo={() => setShowAddFriendDialog(false)}
      />
    </div>
  );
}
