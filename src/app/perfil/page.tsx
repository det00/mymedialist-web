"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Edit, 
  Users, 
  Eye, 
  User, 
  Film, 
  Tv, 
  BookOpen, 
  Gamepad2,
  Settings,
  LogOut,
  Bell,
  BarChart3
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AvatarSelector } from "@/components/AvatarSelector";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileSettings } from "@/components/ProfileSettings";
import { ProfileActivity } from "@/components/ProfileActivity";
//import { ProfileCollection } from "@/components/ProfileCollection";
import { ProfileStats } from "@/components/profile-stats";
import { ProfileFriends } from "@/components/ProfileFriends";
import { ProfilePublicView } from "@/components/ProfilePublicView";

// Tipos para los datos
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

export function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Cargar datos de perfil
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        // Simulamos obtener datos del localStorage o API
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }

        // En producción aquí se haría una llamada a la API
        // Para este ejemplo usamos datos simulados
        const mockProfileData: ProfileData = {
          id: "1",
          name: "Carlos Pérez",
          username: "carlosperez",
          bio: "Apasionado por el cine y las series. Siempre buscando nuevas historias que me sorprendan.",
          joinDate: "2024-03-15",
          email: "carlos@example.com",
          avatar: "avatar1",
          stats: {
            totalContent: 87,
            completed: 45,
            inProgress: 12,
            planned: 25,
            dropped: 5,
            movies: 32,
            series: 28,
            books: 15,
            games: 12
          },
          isCurrentUser: true
        };

        // Simular tiempo de carga
        setTimeout(() => {
          setProfileData(mockProfileData);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error("Error al cargar datos de perfil:", error);
        setError("No se pudieron cargar los datos del perfil");
        setLoading(false);
      }
    };

    // Detectar modo oscuro
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    loadProfileData();
  }, [router]);

  // Manejar cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("userData");
    router.push("/");
  };

  // Toggle modo edición
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    // Si estamos en modo preview y activamos edición, desactivamos preview
    if (previewMode) {
      setPreviewMode(false);
    }
  };

  // Toggle modo preview (cómo ve mi perfil otra persona)
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    // Si estamos en modo edición y activamos preview, desactivamos edición
    if (isEditMode) {
      setIsEditMode(false);
    }
  };

  // Guardar cambios del perfil
  const handleSaveProfile = (updatedData: Partial<ProfileData>) => {
    if (profileData) {
      // En producción aquí se haría una llamada a la API
      setProfileData({
        ...profileData,
        ...updatedData
      });
      setIsEditMode(false);
    }
  };

  // Si estamos cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si hay error o no hay datos, mostrar mensaje
  if (error || !profileData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-medium">Error</h3>
              <p className="text-muted-foreground mt-2">
                {error || "No se pudo cargar el perfil"}
              </p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si estamos en modo preview, mostrar la vista pública
  if (previewMode) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vista previa del perfil</h1>
          <Button variant="outline" onClick={togglePreviewMode}>
            <Eye className="h-4 w-4 mr-2" />
            Salir de la vista previa
          </Button>
        </div>

        <ProfilePublicView profileData={profileData} />
      </div>
    );
  }

  // Renderizar página principal de perfil
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna izquierda - Perfil y navegación */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tarjeta de perfil */}
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
                  Se unió en {new Date(profileData.joinDate).toLocaleDateString('es-ES', { 
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
                variant={isEditMode ? "default" : "outline"} 
                size="sm" 
                onClick={toggleEditMode}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditMode ? "Editando" : "Editar"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={togglePreviewMode}
              >
                <Eye className="h-4 w-4 mr-1" />
                Vista previa
              </Button>
            </CardFooter>
          </Card>
          
          {/* Navegación de perfil */}
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                <Button 
                  variant={activeTab === "profile" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
                <Button 
                  variant={activeTab === "activity" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("activity")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Actividad
                </Button>
                <Button 
                  variant={activeTab === "collection" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("collection")}
                >
                  <Film className="h-4 w-4 mr-2" />
                  Colección
                </Button>
                <Button 
                  variant={activeTab === "stats" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("stats")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estadísticas
                </Button>
                <Button 
                  variant={activeTab === "friends" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("friends")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Amigos
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
                <Separator className="my-2" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Columna derecha - Contenido principal */}
        <div className="lg:col-span-9">
          {isEditMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Editar perfil</CardTitle>
                <CardDescription>
                  Actualiza tu información personal y preferencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  profileData={profileData} 
                  onSave={handleSaveProfile} 
                  onCancel={() => setIsEditMode(false)} 
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil</CardTitle>
                    <CardDescription>
                      Tu información personal y preferencias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Información básica */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Sobre mí</h3>
                        <p className="text-muted-foreground">
                          {profileData.bio || "No has añadido una bio aún."}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      {/* Estadísticas de contenido */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Estadísticas de contenido</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Film className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats.movies}</span>
                            <span className="text-xs text-muted-foreground">Películas</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Tv className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats.series}</span>
                            <span className="text-xs text-muted-foreground">Series</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <BookOpen className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats.books}</span>
                            <span className="text-xs text-muted-foreground">Libros</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Gamepad2 className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats.games}</span>
                            <span className="text-xs text-muted-foreground">Juegos</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Información de la cuenta */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Información de la cuenta</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Email:</dt>
                            <dd>{profileData.email}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Nombre de usuario:</dt>
                            <dd>@{profileData.username}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Fecha de registro:</dt>
                            <dd>{new Date(profileData.joinDate).toLocaleDateString()}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={toggleEditMode}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar perfil
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {activeTab === "activity" && <ProfileActivity userId={profileData.id} />}
              {/*activeTab === "collection" && <ProfileCollection userId={profileData.id} />*/}
              {activeTab === "stats" && <ProfileStats profileData={profileData} />}
              {activeTab === "friends" && <ProfileFriends userId={profileData.id} />}
              {activeTab === "settings" && <ProfileSettings userId={profileData.id} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;