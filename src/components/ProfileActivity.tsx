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
import { JSX } from "react";
import 'moment/locale/es';

// Configurar locale español para fechas
moment.locale("es");

// Mapear estado a tipo de acción para los iconos
const getActionTypeFromStatus = (status: string) => {
  const actionTypeMap: Record<string, string> = {
    "E": "started",
    "C": "finished",
    "P": "added",
    "A": "dropped"
  };
  return actionTypeMap[status] || "added";
};

// Obtener descripción de la acción basada en el estado
const getActionDescription = (status: string) => {
  const actionDescriptions: Record<string, string> = {
    "E": "En progreso",
    "C": "Completado",
    "P": "Pendiente",
    "A": "Abandonado"
  };
  return actionDescriptions[status] || "";
};

// Obtener descripción de la acción para oraciones
const getActionDescriptionForSentence = (status: string) => {
  const actionDescriptions: Record<string, string> = {
    "E": "ha empezado",
    "C": "ha completado",
    "P": "ha añadido",
    "A": "ha abandonado"
  };
  return actionDescriptions[status] || "ha actualizado";
};

export function ProfileActivity({ userId }: { userId: string | number }): JSX.Element {
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

  const formatRelativeTime = (dateString: string): string => {
    moment.locale('es');
    return moment.utc(dateString).fromNow();
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
          <Link
            href={`/${activityService.getContentTypeUrl(item.tipo)}/${item.id_api}`}
            key={index}
            className="block cursor-pointer"
          >
            <div className="border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all hover:scale-[1.01] hover:bg-accent/5">
              <div className="flex p-4">
                {/* Imagen */}
                <div className="relative h-24 w-16 flex-shrink-0 mr-4">
                  {item.imagen ? (
                    <Image
                      src={item.imagen}
                      alt={item.titulo}
                      fill
                      sizes={item.imagen}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="bg-muted h-full w-full rounded-md flex items-center justify-center">
                      {getContentIcon(item.tipo)}
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getContentIcon(item.tipo)}
                          {activityService.getContentTypeName(item.tipo)}
                        </Badge>
                        <Badge className="ml-2 flex items-center gap-1" variant="secondary">
                          {getActivityIcon(getActionTypeFromStatus(item.estado))}
                          {getActionDescription(item.estado)}
                        </Badge>
                      </div>

                      <h3 className="font-medium">{item.titulo}</h3>

                      <p className="text-sm mt-1">
                        {getActionDescriptionForSentence(item.estado)} {activityService.getContentTypeName(item.tipo).toLowerCase()}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatRelativeTime(item.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
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