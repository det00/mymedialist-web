import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ContentDetailsProps {
  contenido?: {
    descripcion: string;
    genero: string[];
    autor: string;
    fechaLanzamiento: string;
    // Propiedades específicas según el tipo de contenido
    temporadas?: number;
    episodios?: number;
    paginas?: number;
    duracion?: string;
    valoracion?: number;
  };
  amigos?: Array<{
    id: string;
    nombre: string;
    imagen?: string;
    iniciales: string;
    progreso: string;
    estado: string;
  }>;
}

export function ContentDetails({ contenido, amigos }: ContentDetailsProps) {
  const [activeTab, setActiveTab] = useState("detalles");

  // Función auxiliar para obtener el color basado en el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "T": return "bg-green-500"; // Terminado
      case "E": return "bg-blue-500";  // En progreso
      case "P": return "bg-amber-500"; // Pendiente
      case "A": return "bg-red-500";   // Abandonado
      default: return "bg-slate-400";  // Estado desconocido
    }
  };

  // Si no hay datos, mostrar contenido de placeholder
  if (!contenido) {
    return (
      <Tabs defaultValue="detalles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
        </TabsList>
        <TabsContent value="detalles">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Cargando detalles...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="descripcion">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Cargando descripción...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs 
      defaultValue="detalles" 
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="detalles">Detalles</TabsTrigger>
        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
      </TabsList>
      
      <TabsContent value="detalles">
        <div className="space-y-6">
          {/* Información general */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información</h3>
            
            {/* Géneros */}
            <div className="flex items-start">
              <span className="w-28 font-medium text-muted-foreground">Géneros:</span>
              <div className="flex flex-wrap gap-2">
                {contenido.genero && contenido.genero.map((gen, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full">
                    {gen}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Fecha de lanzamiento */}
            <div className="flex items-center">
              <span className="w-28 font-medium text-muted-foreground">Lanzamiento:</span>
              <span>
                {contenido.fechaLanzamiento}
              </span>
            </div>
            
            {/* Temporadas (para series) */}
            {contenido.temporadas && (
              <div className="flex items-center">
                <span className="w-28 font-medium text-muted-foreground">Temporadas:</span>
                <span>
                  {contenido.temporadas} temporadas
                  {contenido.episodios && ` (${contenido.episodios} episodios)`}
                </span>
              </div>
            )}
            
            {/* Páginas (para libros) */}
            {contenido.paginas && (
              <div className="flex items-center">
                <span className="w-28 font-medium text-muted-foreground">Páginas:</span>
                <span>
                  {contenido.paginas}
                </span>
              </div>
            )}
            
            {/* Duración (para películas) */}
            {contenido.duracion && (
              <div className="flex items-center">
                <span className="w-28 font-medium text-muted-foreground">Duración:</span>
                <span>
                  {contenido.duracion}
                </span>
              </div>
            )}
            
            {/* Valoración */}
            {contenido.valoracion && (
              <div className="flex items-center">
                <span className="w-28 font-medium text-muted-foreground">Valoración:</span>
                <span>
                  {contenido.valoracion}/10
                </span>
              </div>
            )}
          </div>
          
          {/* Separador */}
          {amigos && amigos.length > 0 && <Separator />}
          
          {/* Amigos que lo ven */}
          {amigos && amigos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amigos que lo ven</h3>
              <div className="space-y-4">
                {amigos.map((amigo) => (
                  <div key={amigo.id} className="flex items-center justify-between group hover:bg-muted p-2 rounded-md transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {amigo.imagen ? (
                          <AvatarImage src={amigo.imagen} alt={amigo.nombre} />
                        ) : (
                          <AvatarFallback className={getEstadoColor(amigo.estado) + " text-white"}>
                            {amigo.iniciales}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{amigo.nombre}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline"
                        className={`rounded-full px-3 text-white ${getEstadoColor(amigo.estado)}`}
                      >
                        {amigo.progreso}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="descripcion">
        <div className="bg-muted p-4 rounded-lg">
          <p className="whitespace-pre-line">{contenido.descripcion}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}