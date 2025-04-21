"use client"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileSettings } from "@/components/ProfileSettings";
import { ProfileActivity } from "@/components/ProfileActivity";
import { ProfileCollection } from "@/components/ProfileCollection";
import { ProfileStats } from "@/components/profile-stats";
import { ProfileFriends } from "@/components/ProfileFriends";
import { ProfilePublicView } from "@/components/ProfilePublicView";
import { useProfile } from "@/hooks/useProfile";

export function ProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id') || undefined;
  const [activeTab, setActiveTab] = useState("profile");
  
  // Usar nuestro hook personalizado para manejar el perfil
  const { 
    profileData, 
    loading, 
    error, 
    isEditMode, 
    previewMode, 
    saveProfile,
    toggleFollow,
    logout,
    toggleEditMode,
    togglePreviewMode
  } = useProfile(userId);

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
              <Button className="mt-4 cursor-pointer" onClick={() => window.location.href = "/"}>
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
          <Button variant="outline" onClick={togglePreviewMode} className="cursor-pointer">
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
                <h2 className="text-xl font-bold">{profileData.nombre}</h2>
                <p className="text-muted-foreground text-sm">@{profileData.username}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Se unió en {new Date(profileData.fechaRegistro).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long'
                  })}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <div className="text-center">
                    <p className="font-bold">{profileData.totalContenidos}</p>
                    <p className="text-xs text-muted-foreground">Contenido</p>
                  </div>
                  <Separator orientation="vertical" className="h-10" />
                  <div className="text-center">
                    <p className="font-bold">{profileData.totalAmigos}</p>
                    <p className="text-xs text-muted-foreground">Amigos</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center gap-2 pt-0 pb-6">
              {profileData.esMiPerfil ? (
                <>
                  <Button 
                    variant={isEditMode ? "default" : "outline"} 
                    size="sm" 
                    onClick={toggleEditMode}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditMode ? "Editando" : "Editar"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={togglePreviewMode}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Vista previa
                  </Button>
                </>
              ) : (
                <Button 
                  variant={profileData.siguiendo ? "outline" : "default"}
                  size="sm"
                  onClick={toggleFollow}
                  className="w-full cursor-pointer"
                >
                  {profileData.siguiendo ? "Siguiendo" : "Seguir"}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Navegación de perfil - solo para mi perfil */}
          {profileData.esMiPerfil && (
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Button 
                    variant={activeTab === "profile" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                  <Button 
                    variant={activeTab === "activity" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("activity")}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Actividad
                  </Button>
                  <Button 
                    variant={activeTab === "collection" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("collection")}
                  >
                    <Film className="h-4 w-4 mr-2" />
                    Colección
                  </Button>
                  <Button 
                    variant={activeTab === "stats" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("stats")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Estadísticas
                  </Button>
                  <Button 
                    variant={activeTab === "friends" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("friends")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Amigos
                  </Button>
                  <Button 
                    variant={activeTab === "settings" ? "secondary" : "ghost"} 
                    className="w-full justify-start cursor-pointer"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </nav>
              </CardContent>
            </Card>
          )}
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
                  onSave={saveProfile} 
                  onCancel={() => toggleEditMode()} 
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
                      {profileData.esMiPerfil 
                        ? "Tu información personal y preferencias" 
                        : `Perfil de ${profileData.nombre}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Información básica */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Sobre mí</h3>
                        <p className="text-muted-foreground">
                          {profileData.bio || "No ha añadido una bio aún."}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      {/* Estadísticas de contenido */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Estadísticas de contenido</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Film className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats?.movies || 0}</span>
                            <span className="text-xs text-muted-foreground">Películas</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Tv className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats?.series || 0}</span>
                            <span className="text-xs text-muted-foreground">Series</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <BookOpen className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats?.books || 0}</span>
                            <span className="text-xs text-muted-foreground">Libros</span>
                          </div>
                          <div className="bg-muted rounded-lg p-4 text-center flex flex-col items-center">
                            <Gamepad2 className="h-5 w-5 mb-2 text-primary" />
                            <span className="text-2xl font-bold">{profileData.stats?.games || 0}</span>
                            <span className="text-xs text-muted-foreground">Juegos</span>
                          </div>
                        </div>
                      </div>
                      
                      {profileData.esMiPerfil && (
                        <>
                          <Separator />
                          
                          {/* Información de la cuenta */}
                          <div>
                            <h3 className="text-lg font-medium mb-2">Información de la cuenta</h3>
                            <dl className="space-y-2">
                              <div className="flex justify-between">
                                <dt className="text-muted-foreground">Nombre:</dt>
                                <dd>{profileData.nombre}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-muted-foreground">Nombre de usuario:</dt>
                                <dd>@{profileData.username}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-muted-foreground">Fecha de registro:</dt>
                                <dd>{new Date(profileData.fechaRegistro).toLocaleDateString()}</dd>
                              </div>
                            </dl>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  {profileData.esMiPerfil && (
                    <CardFooter>
                      <Button onClick={toggleEditMode} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar perfil
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )}
              
              {profileData.esMiPerfil && (
                <>
                  {activeTab === "activity" && <ProfileActivity userId={profileData.id} />}
                  {activeTab === "collection" && <ProfileCollection userId={profileData.id} />}
                  {activeTab === "stats" && <ProfileStats profileData={profileData} />}
                  {activeTab === "friends" && <ProfileFriends userId={profileData.id} />}
                  {activeTab === "settings" && <ProfileSettings userId={profileData.id} />}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;