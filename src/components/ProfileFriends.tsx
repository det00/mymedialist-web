import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  UserX,
  FilmIcon,
  TvIcon,
  BookOpenIcon,
  Gamepad2Icon,
  MessageSquare,
  Mail,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos simulados
const mockFriends = [
  {
    id: "1",
    name: "Ana Gómez",
    username: "anagomez",
    bio: "Amante del cine y las series de ciencia ficción.",
    avatar: "initial_#E84393_AG",
    mutualFriends: 5,
    isOnline: true,
    lastActive: "2025-04-18T10:30:00",
    isFollowing: true,
    isFollower: true,
    stats: {
      totalContent: 87,
      shared: 24
    },
    recentActivity: {
      type: "movie",
      title: "Interstellar",
      date: "2025-04-17T18:45:00"
    }
  },
  {
    id: "2",
    name: "Miguel Rivas",
    username: "mrivas",
    bio: "Fanático de la fantasía y los videojuegos RPG.",
    avatar: "avatar3",
    mutualFriends: 3,
    isOnline: false,
    lastActive: "2025-04-15T14:20:00",
    isFollowing: true,
    isFollower: true,
    stats: {
      totalContent: 112,
      shared: 35
    },
    recentActivity: {
      type: "game",
      title: "Baldur's Gate 3",
      date: "2025-04-16T20:10:00"
    }
  },
  {
    id: "3",
    name: "Laura Sánchez",
    username: "laurasanchez",
    bio: "Cinéfila y lectora empedernida.",
    avatar: "initial_#0984E3_LS",
    mutualFriends: 2,
    isOnline: true,
    lastActive: "2025-04-19T09:15:00",
    isFollowing: true,
    isFollower: false,
    stats: {
      totalContent: 94,
      shared: 18
    },
    recentActivity: {
      type: "book",
      title: "Circe",
      date: "2025-04-18T22:30:00"
    }
  },
  {
    id: "4",
    name: "Pablo Martín",
    username: "pablomartin",
    bio: "Apasionado de las series y videojuegos.",
    avatar: "avatar4",
    mutualFriends: 1,
    isOnline: false,
    lastActive: "2025-04-10T11:45:00",
    isFollowing: false,
    isFollower: true,
    stats: {
      totalContent: 76,
      shared: 15
    },
    recentActivity: {
      type: "series",
      title: "The Last of Us",
      date: "2025-04-14T21:20:00"
    }
  },
  {
    id: "5",
    name: "Carlos López",
    username: "carloslopez",
    bio: "Amante del cine clásico y libros históricos.",
    avatar: "initial_#22C55E_CL",
    mutualFriends: 4,
    isOnline: false,
    lastActive: "2025-04-17T08:50:00",
    isFollowing: true,
    isFollower: true,
    stats: {
      totalContent: 129,
      shared: 42
    },
    recentActivity: {
      type: "movie",
      title: "El Padrino",
      date: "2025-04-16T19:45:00"
    }
  }
];

const mockRequests = [
  {
    id: "6",
    name: "Sara Rodríguez",
    username: "srodriguez",
    avatar: "initial_#F59E0B_SR",
    mutualFriends: 2,
    bio: "Adicta a las series y al gaming."
  },
  {
    id: "7",
    name: "David Torres",
    username: "dtorres",
    avatar: "avatar2",
    mutualFriends: 1,
    bio: "Entusiasta de los libros de ciencia ficción."
  }
];

const mockSuggestions = [
  {
    id: "8",
    name: "Elena Moreno",
    username: "emoreno",
    avatar: "initial_#EC4899_EM",
    mutualFriends: 3,
    bio: "Fan de la literatura fantástica y películas de terror.",
    sharedInterests: ["Sci-Fi", "Terror", "Fantasía"]
  },
  {
    id: "9",
    name: "Jorge Fernández",
    username: "jfernandez",
    avatar: "avatar5",
    mutualFriends: 4,
    bio: "Coleccionista de cómics y cinéfilo.",
    sharedInterests: ["Películas", "Superhéroes", "Acción"]
  },
  {
    id: "10",
    name: "Marta Gil",
    username: "mgil",
    avatar: "initial_#8B5CF6_MG",
    mutualFriends: 2,
    bio: "Aficionada a los videojuegos y anime.",
    sharedInterests: ["Anime", "RPG", "Fantasía"]
  }
];

interface ProfileFriendsProps {
  userId: string;
}

export function ProfileFriends({ userId }: ProfileFriendsProps) {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [showRemoveFriendAlert, setShowRemoveFriendAlert] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("recent");
  const [selectedFriend, setSelectedFriend] = useState<typeof mockFriends[0] | null>(null);
  
  // Manejar búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Filtrar amigos según búsqueda
  const filteredFriends = mockFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Ordenar amigos según la opción seleccionada
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    switch (selectedSortOption) {
      case "recent":
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "mutual":
        return b.mutualFriends - a.mutualFriends;
      default:
        return 0;
    }
  });
  
  // Manejar la selección de un amigo para acciones
  const handleSelectFriend = (friend: typeof mockFriends[0]) => {
    setSelectedFriend(friend);
  };
  
  // Función para obtener icono según tipo de contenido
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <FilmIcon className="h-4 w-4" />;
      case "series":
        return <TvIcon className="h-4 w-4" />;
      case "book":
        return <BookOpenIcon className="h-4 w-4" />;
      case "game":
        return <Gamepad2Icon className="h-4 w-4" />;
      default:
        return <FilmIcon className="h-4 w-4" />;
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
      return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Amigos</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de amigos */}
        <TabsContent value="friends" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Mis amigos</CardTitle>
                <Button onClick={() => setShowAddFriendDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Añadir amigo
                </Button>
              </div>
              <CardDescription>
                Tienes {mockFriends.length} amigos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barra de búsqueda y filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar amigos..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-8"
                  />
                </div>
                <Select value={selectedSortOption} onValueChange={setSelectedSortOption}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Actividad reciente</SelectItem>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="mutual">Amigos en común</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Lista de amigos */}
              {sortedFriends.length > 0 ? (
                <div className="space-y-3">
                  {sortedFriends.map(friend => (
                    <div key={friend.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Avatar e información básica */}
                        <div className="relative">
                          <UserAvatar avatarData={friend.avatar} size="lg" />
                          {friend.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{friend.name}</h3>
                              <p className="text-sm text-muted-foreground">@{friend.username}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Enviar mensaje
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                  onClick={() => {
                                    handleSelectFriend(friend);
                                    setShowRemoveFriendAlert(true);
                                  }}
                                >
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Eliminar amigo
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {/* Información adicional */}
                          <div className="mt-2 space-y-2">
                            {/* Actividad reciente */}
                            {friend.recentActivity && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Actividad reciente: </span>
                                <span className="flex items-center gap-1">
                                  {getContentTypeIcon(friend.recentActivity.type)}
                                  <span>{friend.recentActivity.title}</span>
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {formatRelativeTime(friend.recentActivity.date)}
                                  </Badge>
                                </span>
                              </div>
                            )}
                            
                            {/* Etiquetas adicionales */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {friend.mutualFriends} en común
                              </Badge>
                              
                              {friend.isFollowing && friend.isFollower ? (
                                <Badge className="bg-primary/20 text-primary border-none">Amigos mutuos</Badge>
                              ) : friend.isFollowing ? (
                                <Badge variant="outline">Le sigues</Badge>
                              ) : friend.isFollower ? (
                                <Badge variant="outline">Te sigue</Badge>
                              ) : null}
                              
                              <Badge variant="outline">{friend.stats.totalContent} contenidos</Badge>
                              <Badge variant="outline">{friend.stats.shared} compartidos</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron amigos</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    No se encontraron resultados para &quot;{searchQuery}&quot;. Intenta con otro término de búsqueda.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {filteredFriends.length > 0 && (
                <Button variant="outline" className="w-full">
                  Ver todos los amigos
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Pestaña de solicitudes */}
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de amistad</CardTitle>
              <CardDescription>
                Tienes {mockRequests.length} solicitudes pendientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockRequests.length > 0 ? (
                <div className="space-y-4">
                  {mockRequests.map(request => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <UserAvatar avatarData={request.avatar} size="lg" />
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{request.name}</h3>
                              <p className="text-sm text-muted-foreground">@{request.username}</p>
                              <div className="flex items-center mt-1">
                                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{request.mutualFriends} amigos en común</span>
                              </div>
                              <p className="text-sm mt-2">{request.bio}</p>
                            </div>
                            
                            <div className="flex gap-2 sm:flex-col">
                              <Button className="w-full">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Aceptar
                              </Button>
                              <Button variant="outline" className="w-full">
                                <UserX className="h-4 w-4 mr-2" />
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay solicitudes pendientes</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    No tienes solicitudes de amistad pendientes en este momento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pestaña de sugerencias */}
        <TabsContent value="suggestions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personas que quizás conozcas</CardTitle>
              <CardDescription>
                Basado en tus amigos y gustos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <UserAvatar avatarData={suggestion.avatar} size="lg" />
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{suggestion.name}</h3>
                            <p className="text-sm text-muted-foreground">@{suggestion.username}</p>
                            <div className="flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{suggestion.mutualFriends} amigos en común</span>
                            </div>
                            <p className="text-sm mt-2">{suggestion.bio}</p>
                            
                            {/* Intereses compartidos */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {suggestion.sharedInterests.map((interest, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Seguir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Ver más sugerencias
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para añadir amigo */}
      <Dialog open={showAddFriendDialog} onOpenChange={setShowAddFriendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir amigo</DialogTitle>
            <DialogDescription>
              Busca por nombre de usuario o email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Nombre de usuario o email"
                className="w-full"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Las solicitudes de amistad enviadas aparecerán como pendientes hasta que sean aceptadas.
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button>Enviar solicitud</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alerta para eliminar amigo */}
      <AlertDialog open={showRemoveFriendAlert} onOpenChange={setShowRemoveFriendAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar amigo?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedFriend && (
                <>
                  ¿Estás seguro de que quieres eliminar a <strong>{selectedFriend.name}</strong> de tu lista de amigos?
                  Esta acción no se puede deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}