"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EstadoContenidoApi from "@/components/EstadoContenidoApi";
import { contentService, ContentDetail } from "@/lib/content";
import { authService } from "@/lib/auth";

const ContenidoPage = () => {
  const params = useParams();
  const [contenido, setContenido] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<string>("");
  
  // Extraer parámetros de la URL
  const tipo = params?.tipo as string;
  const id = params?.id as string;

  // Cargar los detalles del contenido
  const fetchContenido = useCallback(async () => {
    if (!tipo || !id) {
      console.log("Parámetros de URL incompletos:", { tipo, id });
      setError("No se pudieron obtener los parámetros de la URL");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Verificar si hay token de autenticación
      const token = authService.getToken();
      if (!token) {
        setError("Necesitas iniciar sesión para ver este contenido");
        setLoading(false);
        return;
      }
      
      // Obtener detalles del contenido
      const data = await contentService.getContentDetails(tipo, id);
      
      console.log("Datos recibidos:", data);
      setContenido(data);
      setEstado(data.item?.estado || "");
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("Error al cargar el contenido");
      setLoading(false);
    }
  }, [tipo, id]);

  // Obtener datos al cargar
  useEffect(() => {
    fetchContenido();
  }, [fetchContenido]);

  // Función para refrescar datos después de actualizar el estado
  const handleUpdateSuccess = () => {
    fetchContenido();
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!contenido) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl">No se encontró el contenido</div>
      </div>
    );
  }

  // Verificar que la URL de la imagen sea válida
  const imageUrl =
    contenido.imagen && (contenido.imagen.startsWith("http") || contenido.imagen.startsWith("/"))
      ? contenido.imagen
      : "https://via.placeholder.com/300x450";

  // Función auxiliar para obtener el color basado en el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "C": return "bg-green-500"; // Completado
      case "E": return "bg-blue-500";  // En progreso
      case "P": return "bg-amber-500"; // Pendiente
      case "A": return "bg-red-500";   // Abandonado
      default: return "bg-slate-400";  // Estado desconocido
    }
  };

  // Formatear los amigos para el componente
  const amigosFormateados = contenido.amigos?.map(amigo => {
    // Obtener iniciales a partir del imagen_id o usar un valor predeterminado
    let iniciales = 'US';
    
    if (amigo.imagen_id) {
      // Si imagen_id es algo como "avatar1", extraemos algunas letras para iniciales
      if (amigo.imagen_id.startsWith('avatar')) {
        iniciales = 'AV';
      } else {
        // Si no, tomamos las primeras 2 letras
        iniciales = amigo.imagen_id.substring(0, 2).toUpperCase();
      }
    }
    
    // Determinar el progreso según el tipo de contenido
    let progreso = '';
    if (tipo === 'libro') {
      progreso = 'Cap.X';
    } else if (tipo === 'serie') {
      progreso = 'T3E8';
    } else if (tipo === 'pelicula') {
      // Para películas, el progreso es más simple
      progreso = amigo.estado === 'C' ? '100%' : 'En progreso';
    } else {
      progreso = amigo.estado === 'C' ? 'Completado' : 'En progreso';
    }
    
    return {
      id: amigo.id,
      nombre: `Usuario ${amigo.id}`,
      iniciales: iniciales,
      estado: amigo.estado,
      progreso: progreso
    };
  }) || [];

  // Obtener la primera letra del tipo en mayúscula para la API
  const tipoMayuscula = contenido.tipo?.toUpperCase().charAt(0) || 
                         tipo.toUpperCase().charAt(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Columna izquierda: Información */}
            <div className="flex-1 p-6">
              {/* Título del contenido */}
              <h1 className="text-2xl font-bold mb-2">{contenido.titulo}</h1>
              
              {/* Creador y estado */}
              <p className="text-muted-foreground text-lg mb-4">{contenido.autor}</p>
              
              {/* Estado */}
              <div className="mb-6">
                <EstadoContenidoApi
                  id_api={id}
                  tipo={tipoMayuscula}
                  estadoInicial={estado}
                  onUpdateSuccess={handleUpdateSuccess}
                />
              </div>
              
              <Separator className="mb-6" />
              
              {/* Descripción */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <div className="bg-muted p-4 rounded-md mb-6 max-h-60 overflow-y-auto">
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: contenido.descripcion }}
                  />
                </div>
              </div>
              
              {/* Información adicional */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">Información</h2>
                
                {/* Géneros */}
                <div className="flex">
                  <span className="font-medium w-28 text-foreground">Géneros:</span>
                  <span className="text-muted-foreground">
                    {contenido.genero?.join(', ') || 'No disponible'}
                  </span>
                </div>
                
                {/* Fecha de lanzamiento */}
                <div className="flex">
                  <span className="font-medium w-28 text-foreground">Lanzamiento:</span>
                  <span className="text-muted-foreground">{contenido.fechaLanzamiento}</span>
                </div>
                
                {/* Temporadas (si es una serie) */}
                {tipo === 'serie' && (
                  <div className="flex">
                    <span className="font-medium w-28 text-foreground">Páginas:</span>
                    <span className="text-muted-foreground">{contenido.paginas}</span>
                  </div>
                )}
                
                {/* Duración (si es una película) */}
                {tipo === 'pelicula' && contenido.duracion && (
                  <div className="flex">
                    <span className="font-medium w-28 text-foreground">Duración:</span>
                    <span className="text-muted-foreground">
                      {contenido.duracion} minutos
                    </span>
                  </div>
                )}
                
                {/* Valoración */}
                <div className="flex">
                  <span className="font-medium w-28 text-foreground">Valoración:</span>
                  <span className="text-muted-foreground">
                    {contenido.valoracion ? `${contenido.valoracion}/10` : 'No disponible'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Columna derecha: Imagen y social */}
            <div className="w-full md:w-64 md:border-l border-border p-6">
              {/* Imagen de portada */}
              <div className="w-full mb-6">
                <Image
                  src={imageUrl}
                  alt={contenido.titulo}
                  width={300}
                  height={450}
                  className="rounded-md w-full h-auto object-cover mx-auto"
                  priority
                />
              </div>
              
              {/* Sección "Amigos que lo ven" */}
              {amigosFormateados.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Amigos que lo ven</h3>
                  <div className="space-y-4">
                    {amigosFormateados.map((amigo) => (
                      <div key={amigo.id} className="flex items-center justify-between group hover:bg-muted p-2 rounded-md transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={getEstadoColor(amigo.estado) + " text-white"}>
                              {amigo.iniciales}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{amigo.nombre}</span>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`rounded-full px-2 py-1 text-xs text-white ${getEstadoColor(amigo.estado)}`}
                        >
                          {amigo.progreso}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ContenidoPage