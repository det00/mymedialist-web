"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import type { Contenido } from "@/lib/types";
import EstadoContenido from "@/components/EstadoContenido";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ContenidoPage = () => {
  const [token, setToken] = useState<string | null>("");
  const params = useParams();
  const [contenido, setContenido] = useState<Contenido>();
  const [estado, setEstado] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extraer directamente los parámetros de la URL
  const tipo = params?.tipo as string;
  const id = params?.id as string;

  const fetchContenido = useCallback(async () => {
    if (!token) {
      console.log("Falta token para hacer la solicitud");
      return;
    }

    if (!tipo || !id) {
      console.log("Parámetros de URL incompletos:", { tipo, id });
      setError("No se pudieron obtener los parámetros de la URL");
      setLoading(false);
      return;
    }

    try {
      console.log(`Realizando solicitud a /${tipo} con id_api=${id}`);
      const res = await api.get<Contenido>(`/${tipo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id_api: id,
        },
      });

      console.log("Respuesta recibida:", res.data);
      setContenido(res.data);
      setEstado(res.data.item?.estado || "");
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("Error al cargar el contenido");
      setLoading(false);
    }
  }, [token, tipo, id]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchContenido();
    }
  }, [fetchContenido, token]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!contenido) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-xl">No se encontró el contenido</div>
      </div>
    );
  }

  // Verificar que la URL de la imagen sea válida
  const imageUrl =
    contenido.imagen && contenido.imagen.startsWith("http")
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
  const tipoMayuscula = tipo.toUpperCase().charAt(0);

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
                <EstadoContenido estado={estado} setEstado={(nuevoEstado) => {
                  // Guardar el estado anterior para comparar
                  const estadoAnterior = estado;
                  
                  // Actualizar el estado en la UI inmediatamente para feedback
                  setEstado(nuevoEstado);
                  console.log("Nuevo estado seleccionado:", nuevoEstado);
                  
                  try {
                    // Caso 1: Si no hay estado anterior y ahora se selecciona uno nuevo -> POST (crear)
                    if (!estadoAnterior && nuevoEstado) {
                      setLoading(true);
                      api.post("/user-items", {
                        id_api: id,
                        estado: nuevoEstado,
                        tipo: tipoMayuscula
                      }, {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      }).then(response => {
                        console.log("Contenido añadido con éxito:", response.data);
                        // Si el backend devuelve el ID del item, actualizamos el state
                        if (response.data && response.data.id && contenido) {
                          const itemId: string = String(response.data.id);
                          setContenido({
                            ...contenido,
                            item: {
                              id: itemId,
                              estado: nuevoEstado
                            }
                          });
                        }
                        setLoading(false);
                      }).catch(err => {
                        console.error("Error al añadir contenido:", err);
                        setError("Error al añadir contenido a tu lista");
                        // Revertir estado en UI
                        setEstado(estadoAnterior);
                        setLoading(false);
                      });
                    }
                    // Caso 2: Si había estado anterior y ahora se desmarca (eliminar) -> DELETE
                    else if (estadoAnterior && !nuevoEstado && contenido?.item?.id) {
                      setLoading(true);
                      api.delete(`/user-items/${contenido.item.id}`, {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      }).then(() => {
                        console.log("Contenido eliminado con éxito");
                        // Actualizar el contenido local eliminando el item
                        if (contenido) {
                          const contenidoActualizado = { ...contenido };
                          delete contenidoActualizado.item;
                          setContenido(contenidoActualizado);
                        }
                        setLoading(false);
                      }).catch(err => {
                        console.error("Error al eliminar contenido:", err);
                        setError("Error al eliminar contenido de tu lista");
                        // Revertir estado en UI
                        setEstado(estadoAnterior);
                        setLoading(false);
                      });
                    }
                    // Caso 3: Si había estado anterior y ahora se cambia a otro -> PUT (actualizar)
                    else if (estadoAnterior && nuevoEstado && estadoAnterior !== nuevoEstado && contenido?.item?.id) {
                      setLoading(true);
                      api.put(`/user-items/${contenido.item.id}`, {
                        estado: nuevoEstado
                      }, {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                      }).then(() => {
                        console.log("Estado actualizado con éxito");
                        // Actualizar el contenido local con el nuevo estado
                        if (contenido && contenido.item) {
                          setContenido({
                            ...contenido,
                            item: {
                              id: contenido.item.id,
                              estado: nuevoEstado
                            }
                          });
                        }
                        setLoading(false);
                      }).catch(err => {
                        console.error("Error al actualizar estado:", err);
                        setError("Error al actualizar el estado del contenido");
                        // Revertir estado en UI
                        setEstado(estadoAnterior);
                        setLoading(false);
                      });
                    }
                  } catch (err) {
                    console.error("Error general en el manejo de estado:", err);
                    setError("Ha ocurrido un error al procesar la solicitud");
                    setEstado(estadoAnterior);
                    setLoading(false);
                  }
                }} />
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
                    <span className="font-medium w-28 text-foreground">Temporadas:</span>
                    <span className="text-muted-foreground">
                      {contenido.temporadas || '?'} temporadas 
                      {contenido.episodios ? ` (${contenido.episodios} episodios)` : ''}
                    </span>
                  </div>
                )}
                
                {/* Páginas (si es un libro) */}
                {tipo === 'libro' && contenido.paginas && (
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

export default ContenidoPage;