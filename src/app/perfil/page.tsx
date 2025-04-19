"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { useRouter } from "next/navigation";

// Interfaces para los datos
interface ProfileData {
  id: string;
  nombre: string;
  username: string;
  fechaRegistro: string;
  totalContenidos: number;
  totalAmigos: number;
  avatar?: {
    color: string;
    iniciales: string;
  };
  esMiPerfil: boolean;
  siguiendo: boolean;
}

interface ActivityItem {
  id: string;
  contentId: string;
  contentApiId: string;
  contentTitle: string;
  contentType: string;
  contentImage?: string;
  actionType: "started" | "finished" | "added" | "dropped" | "rated";
  timestamp: string;
  status?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("activity");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          // Si no hay token, redirigir al inicio
          router.push("/");
          return;
        }

        // ID de usuario - en un caso real obtendríamos esto de la URL o params
        const userId = localStorage.getItem("id_usuario");
        
        if (!userId) {
          setError("No se pudo obtener el ID de usuario");
          setLoading(false);
          return;
        }

        // En un entorno real, estas solicitudes se harían a la API
        // Por ahora, usamos datos de ejemplo
        setProfile(getFakeProfile(userId));
        setActivities(getFakeActivities());
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setError("Error al cargar la información del perfil");
        setLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  // Funciones para obtener datos de ejemplo
  const getFakeProfile = (userId: string): ProfileData => {
    return {
      id: userId,
      nombre: "Carlos Pérez",
      username: "carlosperez",
      fechaRegistro: "2024-03-15T00:00:00.000Z",
      totalContenidos: 45,
      totalAmigos: 12,
      avatar: {
        color: "#6C5CE7",
        iniciales: "CP"
      },
      esMiPerfil: true,
      siguiendo: false
    };
  };

  const getFakeActivities = (): ActivityItem[] => {
    return [
      {
        id: "1",
        contentId: "1",
        contentApiId: "tt0903747",
        contentTitle: "Breaking Bad",
        contentType: "S",
        contentImage: "https://via.placeholder.com/40x60",
        actionType: "finished",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días atrás
        status: "C"
      },
      {
        id: "2",
        contentId: "2",
        contentApiId: "tt6468322",
        contentTitle: "Stranger Things",
        contentType: "S",
        contentImage: "https://via.placeholder.com/40x60",
        actionType: "started",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
        status: "E"
      },
      {
        id: "3",
        contentId: "3",
        contentApiId: "tt10048342",
        contentTitle: "Dune",
        contentType: "P",
        contentImage: "https://via.placeholder.com/40x60",
        actionType: "added",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
        status: "P"
      }
    ];
  };

  // Función para obtener color basado en estado o acción
  const getStatusColor = (activity: ActivityItem) => {
    if (activity.status) {
      switch (activity.status) {
        case "C": return "#22c55e"; // verde - completado
        case "E": return "#3b82f6"; // azul - en progreso
        case "P": return "#eab308"; // amarillo - pendiente
        case "A": return "#ef4444"; // rojo - abandonado
        default: return "#94a3b8";  // gris - desconocido
      }
    }
    
    switch (activity.actionType) {
      case "finished": return "#22c55e"; // verde
      case "started": return "#3b82f6";  // azul
      case "added": return "#eab308";    // amarillo
      case "dropped": return "#ef4444";  // rojo
      case "rated": return "#8b5cf6";    // violeta
      default: return "#94a3b8";         // gris
    }
  };

  // Función para renderizar el tipo de acción en español
  const renderActionType = (activity: ActivityItem) => {
    switch (activity.actionType) {
      case "finished": return "Ha terminado";
      case "started": return "Ha empezado a ver";
      case "added": return "Ha añadido a su lista";
      case "dropped": return "Ha abandonado";
      case "rated": return "Ha valorado";
      default: return "Ha actualizado";
    }
  };

  // Función para manejar seguir/dejar de seguir
  const handleFollowToggle = () => {
    if (!profile) return;
    
    // En un entorno real, aquí haríamos una llamada a la API
    setProfile({
      ...profile,
      siguiendo: !profile.siguiendo
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error || "No se pudo cargar el perfil"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-24 py-8">
      {/* Cabecera de perfil */}
      <Card className="w-full mb-6 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar de usuario */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 md:h-32 md:w-32" style={{ backgroundColor: profile.avatar?.color || "#6C5CE7" }}>
              <AvatarFallback className="text-white text-4xl font-bold">
                {profile.avatar?.iniciales || "CP"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Información de usuario */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold">{profile.nombre}</h1>
            <p className="text-muted-foreground">
              @{profile.username} · Se unió en {moment(profile.fechaRegistro).format("MMMM YYYY")}
            </p>
            
            {/* Estadísticas del usuario */}
            <div className="flex justify-center md:justify-start gap-6 mt-4">
              <div>
                <span className="font-bold">{profile.totalContenidos}</span>
                <span className="text-muted-foreground ml-2">Contenidos</span>
              </div>
              <div>
                <span className="font-bold">{profile.totalAmigos}</span>
                <span className="text-muted-foreground ml-2">Amigos</span>
              </div>
            </div>
          </div>
          
          {/* Botones de acción (solo visibles en perfil de otros) */}
          {!profile.esMiPerfil && (
            <div className="shrink-0">
              <Button 
                onClick={handleFollowToggle}
                variant={profile.siguiendo ? "outline" : "default"}
              >
                {profile.siguiendo ? "Siguiendo" : "Seguir"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Pestañas de navegación */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 border-b w-full justify-start rounded-none bg-transparent gap-4">
          <TabsTrigger 
            value="activity" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none border-transparent pb-2"
          >
            Actividad
          </TabsTrigger>
          <TabsTrigger 
            value="collection" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none border-transparent pb-2"
          >
            Colección
          </TabsTrigger>
          <TabsTrigger 
            value="friends" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none border-transparent pb-2"
          >
            Amigos
          </TabsTrigger>
          <TabsTrigger 
            value="lists" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none border-transparent pb-2"
          >
            Listas
          </TabsTrigger>
        </TabsList>
        
        {/* Contenido de la pestaña de actividad */}
        <TabsContent value="activity" className="mt-0">
          <h2 className="text-xl font-bold mb-4">Actividad reciente</h2>
          
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay actividad reciente para mostrar</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4">
                    {/* Miniatura del contenido */}
                    <div className="flex-shrink-0 w-10 h-15 bg-muted rounded">
                      {activity.contentImage && (
                        <Image
                          src={activity.contentImage}
                          alt={activity.contentTitle}
                          width={40}
                          height={60}
                          className="rounded object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {/* Título y acción */}
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
                        className="font-bold hover:underline"
                      >
                        {renderActionType(activity)} {activity.contentTitle}
                      </Link>
                      
                      {/* Fecha */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {moment(activity.timestamp).fromNow()}
                      </p>
                    </div>
                    
                    {/* Indicador de estado */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: getStatusColor(activity) }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Placeholder para otras pestañas */}
        <TabsContent value="collection">
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Ver la colección completa del usuario</p>
            <Link href="/coleccion">
              <Button className="mt-4">Ver mi colección</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="friends">
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Ver los amigos del usuario</p>
            <Link href="/amigos">
              <Button className="mt-4">Ver mis amigos</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="lists">
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Ver las listas creadas por el usuario</p>
            <Link href="/listas">
              <Button className="mt-4">Ver mis listas</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}