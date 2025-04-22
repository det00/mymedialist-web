import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Eye,
  RefreshCw
} from "lucide-react";
import { useActivity } from "@/hooks/useActivity";
import { activityService } from "@/lib/activity";
import moment from "moment";
import { 
  CONTENT_TYPE_FILTERS, 
  ACTION_TYPE_FILTERS, 
  TIME_FILTERS 
} from "@/lib/constants";

// Configurar locale español para fechas
moment.locale("es");

interface ProfileActivityProps {
  userId: string;
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  const { 
    activities, 
    loading, 
    error, 
    hasMore, 
    timeFilter, 
    contentType, 
    activityType,
    filterByContentType,
    filterByActivityType,
    filterByTime,
    loadMore,
    refreshActivity
  } = useActivity(userId);

  // Obtener icono por tipo de contenido
  const getContentIcon = (type: string) => {
    switch (type) {
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
  
  // Obtener icono por tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "finished":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "started":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "added":
        return <PlusCircle className="h-4 w-4 text-cyan-500" />;
      case "dropped":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };
  
  // Formatear fecha relativa
  const formatRelativeTime = (dateString: string) => {
    return moment(dateString).fromNow();
  };
  
  // Renderizar actividad
  const renderActivityItems = () => {
    if (loading && activities.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando actividad...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-12 text-center">
          <p className="text-destructive mb-2">{error}</p>
          <Button 
            onClick={refreshActivity}
            variant="outline"
            className="cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
        </div>
      );
    }
    
    if (activities.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No se encontró actividad con los filtros seleccionados.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {activities.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden hover:border-primary transition-colors">
            <div className="flex p-4">
              {/* Imagen */}
              <div className="relative h-24 w-16 flex-shrink-0 mr-4">
                {item.contentImage ? (
                  <Image
                    src={item.contentImage}
                    alt={item.contentTitle}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="bg-muted h-full w-full rounded-md flex items-center justify-center">
                    {getContentIcon(item.contentType)}
                  </div>
                )}
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getContentIcon(item.contentType)}
                        {activityService.getContentTypeName(item.contentType)}
                      </Badge>
                      <Badge className="ml-2 flex items-center gap-1">
                        {getActivityIcon(item.actionType)}
                        {item.actionType === "started" && item.status === "E" ? "En progreso" : ""}
                      </Badge>
                    </div>
                    
                    <Link 
                      href={`/${activityService.getContentTypeUrl(item.contentType)}/${item.contentApiId}`}
                      className="hover:underline"
                    >
                      <h3 className="font-medium">{item.contentTitle}</h3>
                    </Link>
                    
                    <p className="text-sm mt-1">
                      {activityService.getActionDescription(item.actionType)} {activityService.getContentTypeName(item.contentType).toLowerCase()}
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {formatRelativeTime(item.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Botón para cargar más */}
        {hasMore && (
          <div className="text-center pt-4">
            <Button 
              onClick={loadMore} 
              disabled={loading}
              variant="outline"
              className="cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  Cargando...
                </>
              ) : (
                "Cargar más"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
          <CardDescription>
            Lo que has estado viendo, leyendo y jugando
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filtro por tipo de contenido */}
            <Select 
              value={contentType} 
              onValueChange={filterByContentType}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPE_FILTERS.map(filter => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro por tipo de actividad */}
            <Select 
              value={activityType} 
              onValueChange={filterByActivityType}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPE_FILTERS.map(filter => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro por tiempo */}
            <Select 
              value={timeFilter} 
              onValueChange={filterByTime}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {TIME_FILTERS.map(filter => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Lista de actividad */}
          {renderActivityItems()}
        </CardContent>
      </Card>
    </div>
  );
}